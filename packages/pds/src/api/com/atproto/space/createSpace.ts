// @ts-nocheck

import { CID } from 'multiformats/cid'
import { InvalidRecordKeyError } from '@atproto/syntax'
import { AuthRequiredError, InvalidRequestError } from '@atproto/xrpc-server'
import { AppContext } from '../../../../context'
import { Server } from '../../../../lexicon'
import { dbLogger } from '../../../../logger'
import * as LEX from '../../../../lexicon/lexicons'
import {
  BadCommitSwapError,
  InvalidRecordError,
  PreparedCreate,
  prepareCreate,
  prepareDelete,
} from '../../../../space'

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.space.createSpace({
    auth: ctx.authVerifier.authorization({
      // @NOTE the "checkTakedown" and "checkDeactivated" checks are typically
      // performed during auth. However, since this method's "repo" parameter
      // can be a handle, we will need to fetch the account again to ensure that
      // the handle matches the DID from the request's credentials. In order to
      // avoid fetching the account twice (during auth, and then again in the
      // controller), the checks are disabled here:

      // checkTakedown: true,
      // checkDeactivated: true,
      authorize: () => {
        // Performed in the handler as it requires the request body
      },
    }),
    rateLimit: [
      {
        name: 'repo-write-hour',
        calcKey: ({ auth }) => auth.credentials.did,
        calcPoints: () => 3,
      },
      {
        name: 'repo-write-day',
        calcKey: ({ auth }) => auth.credentials.did,
        calcPoints: () => 3,
      },
    ],
    handler: async ({ input, auth }) => {
      // check that we have some auth for the requestor to work with
      if (!auth.credentials.did) {
        throw new AuthRequiredError()
      }
      const reqDid = auth.credentials.did

      // destructure the payload
      const { repo, parent, record, validate, swapCommit } =
        input.body

      console.log('create space', { reqDid, repo, parent, record })

      // lookup the account that owns the space
      const account = await ctx.authVerifier.findAccount(repo, {
        checkDeactivated: true,
        checkTakedown: true,
      })

      // check permissions to perform action
      // lookup from lexicon doc
      const schema = LEX.schemaDict.ComAtprotoSpaceSpace
      // const perm = schema.defs.main["auth"]
      console.log('space create perm', schema.defs.main)

      // WARN, this is no longer sufficient for permissioned spaces
      // as others should be able to create spaces on behalf of the account
      // but it will work for now and for the blebbit alpha
      const did = account.did
      if (did !== reqDid) {
        throw new AuthRequiredError()
      }


      if (auth.credentials.type === 'oauth') {
        // TODO, this probably needs to change or be extended?
        // what if we only want to grant certain oauth scopes on a per-space basis?
        // maybe this is just a quick, granular check
        auth.credentials.permissions.assertRepo({
          action: 'create',
          collection: LEX.ids.ComAtprotoSpaceSpace,
        })
      }

      // get or gen the space id
      var { space } = input.body
      if (!space || space.length < 1) {
        space = ctx.genCuid['16']()
      }

      const swapCommitCid = swapCommit ? CID.parse(swapCommit) : undefined

      // create a write for the new space record
      let write: PreparedCreate
      try {
        write = await prepareCreate({
          space,
          did,
          collection: LEX.ids.ComAtprotoSpaceSpace,
          record,
          rkey: "self",
          validate,
        })
      } catch (err) {
        console.error('error preparing create', err)
        // if (err instanceof InvalidRecordError) {
        //   throw new InvalidRequestError(err.message)
        // }
        // if (err instanceof InvalidRecordKeyError) {
        //   throw new InvalidRequestError(err.message)
        // }
        throw err
      }

      // perpare the write for the new space owner relation
      let owner: PreparedCreate
      try {
        // this depends on if parent is set
        // if parent is set, we need to verify that the parent exists
        // and then change the relationship we create
        // owner = await prepareCreate({
        //   space,
        //   did,
        //   collection: LEX.ids.ComAtprotoSpaceRelationship,
        //   record,
        //   rkey: ctx.genCuid['16'](),
        //   validate,
        // })
      } catch (err) {
        console.error('error preparing owner', err)
        // if (err instanceof InvalidRecordError) {
        //   throw new InvalidRequestError(err.message)
        // }
        // if (err instanceof InvalidRecordKeyError) {
        //   throw new InvalidRequestError(err.message)
        // }
        throw err
      }

      //
      // DUAL WRITE PROBLEM
      //

      try {
        // (DWP) write to the repo
        await ctx.actorStore.transact(did, async (actorTxn) => {
          console.log('create space actor txn', { did, repo, space })

          actorTxn.space.createSpace(
            account.did,
            // @ts-ignore
            space,
            reqDid,
            write.uri.rkey,
            write.cid,
            write.record,
          )

        })
      } catch (err) {
        console.error('error during actor txn', err)
        throw err
      }

      // (DWP) write to the perms
      // ...


      return {
        encoding: 'application/json',
        body: {
          uri: write.uri.toString(),
          cid: write.cid.toString(),
          // commit: {
          //   cid: commit.cid.toString(),
          //   rev: commit.rev,
          // },
          validationStatus: write.validationStatus,
        },
      }
    },
  })
}
