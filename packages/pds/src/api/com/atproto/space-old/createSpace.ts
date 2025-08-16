import { InvalidRecordKeyError } from '@atproto/syntax'
import { InvalidRequestError } from '@atproto/xrpc-server'
import { AppContext } from '../../../../context'
import { Server } from '../../../../lexicon'
import * as LEX from '../../../../lexicon/lexicons'
import {
  createRelationship,
} from '../../../../authz/spicedb'
import {
  atproto2spicedb,
  aturi2spicedb,
  checkPermission,
  dualWriteTransaction,
  preflightChecks,
  BadCommitSwapError,
  InvalidRecordError,
  PreparedCreate,
  prepareCreate,
  prepareDelete,
} from '../../../../space'
import { ActorStoreTransactor } from '../../../../actor-store/actor-store-transactor'
import { assertSpice } from './utils'

/*
 *
 *  DO THIS - recursive spaces prevention
 *  https://authzed.com/docs/spicedb/modeling/recursion-and-max-depth#how-do-i-check-for-a-possible-recursion-when-writing-a-relationship
 *
*/

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
      assertSpice(ctx)

      const label = "createSpace"
      console.log(`${label}.input:`, input)

      let space: string
      let reqDid: string
      let repoDid: string
      let spaceRecord: PreparedCreate

      try {

        // deconstruct body
        // perhaps these should be switched for consistency
        var { repo, parent, rkey, record, validate } = input.body

        // set some defaults
        if (!rkey || rkey.length < 1) {
          rkey = ctx.genCuid['16']()
        }

        // more validation, DID resolving
        const preflight = await preflightChecks({
          ctx,
          auth,
          // the space we embed in
          repo,
          space: parent,
          collection: LEX.ids.ComAtprotoSpaceSpace,
          rkey,
          record,
        })
        reqDid = preflight.reqDid
        repoDid = preflight.repoDid
        space = preflight.space
        rkey = preflight.rkey as string // this will be set, but ts is complaining...

        //
        // check permissions
        //
        await checkPermission({
          spicedbClient: ctx.spicedbClient,
          auth,
          // what we are checking permission wise
          // TODO, support more subject kinds, need to base on auth.credentials.type
          subjectType: 'user',
          subjectId: atproto2spicedb(reqDid),
          permission: LEX.schemaDict.ComAtprotoSpaceCreateSpace.defs.main["auth"].permission,
          objectType: 'space',
          objectId:  `${atproto2spicedb(repoDid)}/${atproto2spicedb(space)}`,
          collectionOp: LEX.ids.ComAtprotoSpaceCreateSpace,
        })

        // (self/profile): prepare a write for the new space record
        spaceRecord = await prepareCreate({
          reqDid,
          repoDid,
          space,
          collection: LEX.ids.ComAtprotoSpaceSpace,
          rkey,
          record,
          validate,
        })

      } catch (err) {
        if (err instanceof InvalidRecordError
         || err instanceof InvalidRecordKeyError
        ) {
          throw new InvalidRequestError(err.message)
        }
        throw err
      }
      console.log(`${label}.body:`, input.body)

      // we can make create stuff now

      // relation values we will write to the repo & authz along with the record
      // NOTE, need to use the "full" URI here for both subject & resource
      // ... but not the space query param, that is what we are capturing here
      // subject is the parent space, resource is the new space
      const subject = `space:${atproto2spicedb(repoDid)}/${atproto2spicedb(spaceRecord.uri.space)}`
      const relation = 'parent'
      const resource = `space:${atproto2spicedb(repoDid)}/${atproto2spicedb(spaceRecord.uri.rkey)}`
      console.log(`createSpace.spicedb: ${resource}#${relation}@${subject}`)

      // (owner/parent): prepare a write for the relationship record
      const spaceRelation = await prepareCreate({
        reqDid,
        repoDid,
        space: spaceRecord.uri.space,
        collection: LEX.ids.ComAtprotoSpaceRelation,
        rkey: ctx.genCuid['16'](),
        record: {
          subject,
          relation,
          resource,
        },
      })

      //
      // DUAL WRITE PROBLEM
      //
      await dualWriteTransaction({
        ctx,
        repo: repoDid,

        // (DWP/1) writes to the repo database
        actorOps: async (actorTxn: ActorStoreTransactor) => {

          // space (self/profile) record
          actorTxn.space.insertRecord({
            uri: spaceRecord.uri,
            parent: spaceRecord.parentUri.toString(),
            space: spaceRecord.uri.space,
            collection: spaceRecord.uri.collection,
            rkey: spaceRecord.uri.rkey,
            cid: spaceRecord.cid,
            record: spaceRecord.record,
            did: reqDid,
          })

          // space (owner/parent) record
          actorTxn.space.insertRecord({
            uri: spaceRelation.uri,
            parent: spaceRelation.parentUri.toString(),
            space: spaceRelation.uri.space,
            collection: spaceRelation.uri.collection,
            rkey: spaceRelation.uri.rkey,
            cid: spaceRelation.cid,
            record: spaceRelation.record,
            did: reqDid,
          })

        },

        // (DWP/2) writes to the authz service
        authzOps: async (spicedbClient) => {
          await createRelationship(spicedbClient, resource, relation, subject)
        },
      })

      // TODO, (DWP/3) background reconciliation process

      // success!
      return {
        encoding: 'application/json',
        body: {
          uri: spaceRecord.uri.toString(),
          cid: spaceRecord.cid.toString(),
          validationStatus: spaceRecord.validationStatus,
        },
      }
    },
  })
}
