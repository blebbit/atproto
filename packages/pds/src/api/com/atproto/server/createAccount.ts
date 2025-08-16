import * as plc from '@did-plc/lib'
import { isEmailValid } from '@hapi/address'
import { isDisposableEmail } from 'disposable-email-domains-js'
import { DidDocument, MINUTE, check } from '@atproto/common'
import { AtUri } from '@atproto/syntax'
import { ExportableKeypair, Keypair, Secp256k1Keypair } from '@atproto/crypto'
import { AtprotoData, ensureAtpDocument } from '@atproto/identity'
import { AuthRequiredError, InvalidRequestError } from '@atproto/xrpc-server'
import { AccountStatus } from '../../../../account-manager/account-manager'
import { NEW_PASSWORD_MAX_LENGTH } from '../../../../account-manager/helpers/scrypt'
import { AppContext } from '../../../../context'
import { baseNormalizeAndValidate } from '../../../../handle'
import { Server } from '../../../../lexicon'
import { InputSchema as CreateAccountInput } from '../../../../lexicon/types/com/atproto/server/createAccount'
import { syncEvtDataFromCommit } from '../../../../sequencer'
import { safeResolveDidDoc } from './util'
import { touchRelationship } from '../../../../authz/spicedb'
import { cidForSafeRecord } from '../../../../repo'
import { aturi2spicedb } from '../../../../space'

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.server.createAccount({
    rateLimit: {
      durationMs: 5 * MINUTE,
      points: 100,
    },
    auth: ctx.authVerifier.userServiceAuthOptional,
    handler: async ({ input, auth, req }) => {
      // @NOTE Until this code and the OAuthStore's `createAccount` are
      // refactored together, any change made here must be reflected over there.

      const requester = auth.credentials?.did ?? null
      const {
        did,
        handle,
        email,
        password,
        inviteCode,
        signingKey,
        plcOp,
        deactivated,
      } = ctx.entrywayAgent
        ? await validateInputsForEntrywayPds(ctx, input.body)
        : await validateInputsForLocalPds(ctx, input.body, requester)

      let didDoc: DidDocument | undefined
      let creds: { accessJwt: string; refreshJwt: string }
      await ctx.actorStore.create(did, signingKey)
      try {
        /*
          To create the initial repo/spaces setup...
          1. create empty public repo
          2. store records in sqlite
            2.1 owner relation record (owner)
            2.2 root space self record ("profile")
            2.3 root space self relation record (parent)
          3. touch relatioins in spicedb
            3.1 acct -> owner -> space
            3.2 space -> parent -> record
        */

        const acctSpiceId = `acct:${aturi2spicedb(did)}`
        const rootSpiceId = `space:${aturi2spicedb(did)}/root`
        const selfSpiceId = `record:${aturi2spicedb(did)}/root/${aturi2spicedb("com.atproto.space.space")}/self`

        // DUAL WRITE
        // (1) create repo
        const commit = await ctx.actorStore.transact(did, async (actorTxn) => {
          // init public repo
          const r = actorTxn.repo.createRepo([])

          // create owner relation record
          const ownerRelnRkey = ctx.genCuid['16']()
          const ownerRelnUri = AtUri.make(did, "com.atproto.space.relation", ownerRelnRkey, "")
          const ownerRelnRecord = {
            resource: rootSpiceId,
            relation: "owner",
            subject: acctSpiceId,
          }
          await actorTxn.space.insertRecord({
            uri: ownerRelnUri,
            reqDid: did,
            parent: "",
            record: ownerRelnRecord
          })

          // create root space self record
          const uri = AtUri.make(did, "com.atproto.space.space", "self", "root")
          await actorTxn.space.insertRecord({
            uri,
            reqDid: did,
            parent: "",
            record: {
              name: "root",
              $type: "com.atproto.space.space"
            }
          })

          // create self relation record
          const selfRelnRkey = ctx.genCuid['16']()
          const selfRelnUri = AtUri.make(did, "com.atproto.space.relation", selfRelnRkey, "root")
          const selfRelnRecord = {
            resource: selfSpiceId,
            relation: "parent",
            subject: rootSpiceId,
          }
          await actorTxn.space.insertRecord({
            uri: selfRelnUri,
            reqDid: did,
            parent: "root",
            record: selfRelnRecord
          })


          return r
        }

        )
        // (2) set account as owner over root space
        if (ctx.spicedbClient) {
          try {
            await touchRelationship(ctx.spicedbClient,
              rootSpiceId,
              'owner',
              acctSpiceId,
            )
            await touchRelationship(ctx.spicedbClient,
              selfSpiceId,
              'parent',
              rootSpiceId,
            )
          } catch (err) {
            // temp, dev-env is creating duplicate accounts
            // or not cleaning up properly (shortcut? re: but not spicedb)
            console.error('failed to set user as owner of root space', err)
          }
        }

        // Generate a real did with PLC
        if (plcOp) {
          try {
            await ctx.plcClient.sendOperation(did, plcOp)
          } catch (err) {
            req.log.error(
              { didKey: ctx.plcRotationKey.did(), handle },
              'failed to create did:plc',
            )
            throw err
          }
        }

        didDoc = await safeResolveDidDoc(ctx, did, true)

        creds = await ctx.accountManager.createAccountAndSession({
          did,
          handle,
          email,
          password,
          repoCid: commit.cid,
          repoRev: commit.rev,
          inviteCode,
          deactivated,
        })

        if (!deactivated) {
          await ctx.sequencer.sequenceIdentityEvt(did, handle)
          await ctx.sequencer.sequenceAccountEvt(did, AccountStatus.Active)
          await ctx.sequencer.sequenceCommit(did, commit)
          await ctx.sequencer.sequenceSyncEvt(
            did,
            syncEvtDataFromCommit(commit),
          )
        }
        await ctx.accountManager.updateRepoRoot(did, commit.cid, commit.rev)
        await ctx.actorStore.clearReservedKeypair(signingKey.did(), did)
      } catch (err) {
        // this will only be reached if the actor store _did not_ exist before
        await ctx.actorStore.destroy(did)
        throw err
      }

      return {
        encoding: 'application/json',
        body: {
          handle,
          did: did,
          didDoc,
          accessJwt: creds.accessJwt,
          refreshJwt: creds.refreshJwt,
        },
      }
    },
  })
}

const validateInputsForEntrywayPds = async (
  ctx: AppContext,
  input: CreateAccountInput,
) => {
  const { did, plcOp } = input
  const handle = baseNormalizeAndValidate(input.handle)
  if (!did || !input.plcOp) {
    throw new InvalidRequestError(
      'non-entryway pds requires bringing a DID and plcOp',
    )
  }
  if (!check.is(plcOp, plc.def.operation)) {
    throw new InvalidRequestError('invalid plc operation', 'IncompatibleDidDoc')
  }
  const plcRotationKey = ctx.cfg.entryway?.plcRotationKey
  if (!plcRotationKey || !plcOp.rotationKeys.includes(plcRotationKey)) {
    throw new InvalidRequestError(
      'PLC DID does not include service rotation key',
      'IncompatibleDidDoc',
    )
  }
  try {
    await plc.assureValidOp(plcOp)
    await plc.assureValidSig([plcRotationKey], plcOp)
  } catch (err) {
    throw new InvalidRequestError('invalid plc operation', 'IncompatibleDidDoc')
  }
  const doc = plc.formatDidDoc({ did, ...plcOp })
  const data = ensureAtpDocument(doc)

  let signingKey: ExportableKeypair | undefined
  if (input.did) {
    signingKey = await ctx.actorStore.getReservedKeypair(input.did)
  }
  if (!signingKey) {
    signingKey = await ctx.actorStore.getReservedKeypair(data.signingKey)
  }
  if (!signingKey) {
    throw new InvalidRequestError('reserved signing key does not exist')
  }

  validateAtprotoData(data, {
    handle,
    pds: ctx.cfg.service.publicUrl,
    signingKey: signingKey.did(),
  })

  return {
    did,
    handle,
    email: undefined,
    password: undefined,
    inviteCode: undefined,
    signingKey,
    plcOp,
    deactivated: false,
  }
}

const validateInputsForLocalPds = async (
  ctx: AppContext,
  input: CreateAccountInput,
  requester: string | null,
) => {
  const { email, password, inviteCode } = input
  if (input.plcOp) {
    throw new InvalidRequestError('Unsupported input: "plcOp"')
  }

  if (password && password.length > NEW_PASSWORD_MAX_LENGTH) {
    throw new InvalidRequestError(
      `Password too long. Maximum length is ${NEW_PASSWORD_MAX_LENGTH} characters.`,
    )
  }

  if (ctx.cfg.invites.required && !inviteCode) {
    throw new InvalidRequestError(
      'No invite code provided',
      'InvalidInviteCode',
    )
  }

  if (!email) {
    throw new InvalidRequestError('Email is required')
  } else if (!isEmailValid(email) || isDisposableEmail(email)) {
    throw new InvalidRequestError(
      'This email address is not supported, please use a different email.',
    )
  }

  // normalize & ensure valid handle
  const handle = await ctx.accountManager.normalizeAndValidateHandle(
    input.handle,
    { did: input.did },
  )

  // check that the invite code still has uses
  if (ctx.cfg.invites.required && inviteCode) {
    await ctx.accountManager.ensureInviteIsAvailable(inviteCode)
  }

  // check that the handle and email are available
  const [handleAccnt, emailAcct] = await Promise.all([
    ctx.accountManager.getAccount(handle),
    ctx.accountManager.getAccountByEmail(email),
  ])
  if (handleAccnt) {
    throw new InvalidRequestError(`Handle already taken: ${handle}`)
  } else if (emailAcct) {
    throw new InvalidRequestError(`Email already taken: ${email}`)
  }

  // determine the did & any plc ops we need to send
  // if the provided did document is poorly setup, we throw
  const signingKey = await Secp256k1Keypair.create({ exportable: true })

  let did: string
  let plcOp: plc.Operation | null
  let deactivated = false
  if (input.did) {
    if (input.did !== requester) {
      throw new AuthRequiredError(
        `Missing auth to create account with did: ${input.did}`,
      )
    }
    did = input.did
    plcOp = null
    deactivated = true
  } else {
    const formatted = await formatDidAndPlcOp(ctx, handle, input, signingKey)
    did = formatted.did
    plcOp = formatted.plcOp
  }

  return {
    did,
    handle,
    email,
    password,
    inviteCode,
    signingKey,
    plcOp,
    deactivated,
  }
}

const formatDidAndPlcOp = async (
  ctx: AppContext,
  handle: string,
  input: CreateAccountInput,
  signingKey: Keypair,
): Promise<{
  did: string
  plcOp: plc.Operation | null
}> => {
  // if the user is not bringing a DID, then we format a create op for PLC
  const rotationKeys = [ctx.plcRotationKey.did()]
  if (ctx.cfg.identity.recoveryDidKey) {
    rotationKeys.unshift(ctx.cfg.identity.recoveryDidKey)
  }
  if (input.recoveryKey) {
    rotationKeys.unshift(input.recoveryKey)
  }
  const plcCreate = await plc.createOp({
    signingKey: signingKey.did(),
    rotationKeys,
    handle,
    pds: ctx.cfg.service.publicUrl,
    signer: ctx.plcRotationKey,
  })
  return {
    did: plcCreate.did,
    plcOp: plcCreate.op,
  }
}
const validateAtprotoData = (
  data: AtprotoData,
  expected: {
    handle: string
    pds: string
    signingKey: string
  },
) => {
  // if the user is bringing their own did:
  // resolve the user's did doc data, including rotationKeys if did:plc
  // determine if we have the capability to make changes to their DID
  if (data.handle !== expected.handle) {
    throw new InvalidRequestError(
      'provided handle does not match DID document handle',
      'IncompatibleDidDoc',
    )
  } else if (data.pds !== expected.pds) {
    throw new InvalidRequestError(
      'DID document pds endpoint does not match service endpoint',
      'IncompatibleDidDoc',
    )
  } else if (data.signingKey !== expected.signingKey) {
    throw new InvalidRequestError(
      'DID document signing key does not match service signing key',
      'IncompatibleDidDoc',
    )
  }
}
