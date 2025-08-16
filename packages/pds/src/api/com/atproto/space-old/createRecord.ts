import { InvalidRecordKeyError } from '@atproto/syntax'
import { InvalidRequestError } from '@atproto/xrpc-server'
import { AppContext } from '../../../../context'
import { Server } from '../../../../lexicon'
import * as LEX from '../../../../lexicon/lexicons'
import {
  checkPermission,
  dualWriteTransaction,
  preflightChecks,
  InvalidRecordError,
  PreparedCreate,
  prepareCreate,
} from '../../../../space'
import { ActorStoreTransactor } from '../../../../actor-store/actor-store-transactor'
import { assertSpice } from './utils'

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.space.createRecord({
    auth: ctx.authVerifier.authorization({
      // @NOTE the "checkTakedown" and "checkDeactivated" checks are typically
      // performed during auth. However., since this method's "repo" parameter
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

      const label = "createRecord"
      console.log(`${label}.input:`, input)

      let reqDid: string
      let repoDid: string
      let preparedRecord: PreparedCreate

      try {

        // deconstruct body
        // perhaps these should be switched for consistency
        var { repo, space, collection, rkey, record, validate } = input.body

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
          space,
          collection,
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
          subjectId: reqDid,
          permission: LEX.schemaDict.ComAtprotoSpaceCreateRecord.defs.main["auth"].permission,
          objectType: 'space',
          objectId:  `${repoDid}/${LEX.ids.ComAtprotoSpaceSpace}/${space}`,
          collectionOp: LEX.ids.ComAtprotoSpaceCreateRecord,
        })

        // (self/profile): prepare a write for the new space record
        preparedRecord = await prepareCreate({
          reqDid,
          repoDid,
          space,
          collection,
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
            uri: preparedRecord.uri,
            space: preparedRecord.uri.space,
            collection: preparedRecord.uri.collection,
            rkey: preparedRecord.uri.rkey,
            cid: preparedRecord.cid,
            record: preparedRecord.record,
            did: reqDid,
          })

          // what about blobs?
          // and checking / updating the table

          // what about backlinks
          // perhaps we can do better with backlinks by checking into the record JSON
          // does this only apply to the Bsky app view, for likes and reposts?
          // what about refs generally? context dependent it would seem
        },

        // (DWP/2) writes to the authz service
        authzOps: async (spicedbClient) => {
          // await createRelationship(ctx.spicedbClient, resource, relation, subject)
        },
      })

      // success!
      return {
        encoding: 'application/json',
        body: {
          uri: preparedRecord.uri.toString(),
          cid: preparedRecord.cid.toString(),
          validationStatus: preparedRecord.validationStatus,
        },
      }
    },
  })
}