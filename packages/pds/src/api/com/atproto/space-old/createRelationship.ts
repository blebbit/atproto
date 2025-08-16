import { AtUri } from '@atproto/syntax'
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

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.space.createRelationship({
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

      const label = "createGroup"

      let reqDid: string
      let repoDid: string
      let subj: AtUri
      let res: AtUri
      // let space: string

      try {

        // deconstruct body
        // perhaps these should be switched for consistency
        var { repo, space, subjectType, subject, relation, resourceType, resource, validate } = input.body

        // cleanup subject and relation
        subj = new AtUri(subject)
        res = new AtUri(resource)
        // need to map Handles to DIDs
        if (!subj.hostname.startsWith("did:")) {

        }
        if (!res.hostname.startsWith("did:")) {

        }

        const spiceUrl = `${resource}#${relation}@${subject}`

        // more validation, DID resolving, and primary permission checks
        const preflight = await preflightChecks({
          ctx,
          auth,
          // the space we embed in
          repo,
          space,
          collection: LEX.ids.ComAtprotoSpaceCreateRelationship,
          rkey: spiceUrl, // dummy, just for slur checking (might break though)
          record: {},
        })
        reqDid = preflight.reqDid
        repoDid = preflight.repoDid
        space = preflight.space

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
      // check permissions
      //
      await checkPermission({
        spicedbClient: ctx.spicedbClient,
        auth,
        // what we are checking permission wise
        // TODO, support more subject kinds, need to base on auth.credentials.type
        subjectType: 'user',
        subjectId: atproto2spicedb(reqDid),
        permission: LEX.schemaDict.ComAtprotoSpaceCreateRelationship.defs.main["auth"].permission,

        // hmmm what's the object...?
        // probably from the inputs, might need to expose these type/id pairs, eventually conditions too?
        // space or group only, depending on the change?
        objectType: 'space',
        objectId:  `${atproto2spicedb(subj.hostname)}/${atproto2spicedb(subj.space)}`,
        collectionOp: LEX.ids.ComAtprotoSpaceCreateRelationship,
      })


      // permission granted, we can make do stuff now

      // check that subject and object exist (?)


      // relation values we will write to the repo & authz along with the record
      // const subject = `space:${atprotoToSpicedb(groupRecord.uri.space)}`
      // const permission = 'parent'
      // const resource = `space:${atprotoToSpicedb(groupRecord.uri.rkey)}`

      // (owner/parent): prepare a write for the relationship record
      const spaceRelation = await prepareCreate({
        reqDid,
        repoDid,
        space: space,
        collection: LEX.ids.ComAtprotoSpaceRelationship,
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

          // space (owner/parent) record
          actorTxn.space.insertRecord({
            uri: spaceRelation.uri,
            space: spaceRelation.uri.space,
            collection: spaceRelation.uri.collection,
            rkey: spaceRelation.uri.rkey,
            cid: spaceRelation.cid,
            record: spaceRelation.record,
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
          await createRelationship(spicedbClient, resource, relation, subject)
        },
      })

      // success!
      return {
        encoding: 'application/json',
        body: {
          uri: spaceRelation.uri.toString(),
          cid: spaceRelation.cid.toString(),
          // commit: {
          //   cid: commit.cid.toString(),
          //   rev: commit.rev,
          // },
          validationStatus: spaceRelation.validationStatus,
        },
      }
    },
  })
}
