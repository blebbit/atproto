import { INVALID_HANDLE } from '@atproto/syntax'
import { InvalidRecordKeyError } from '@atproto/syntax'
import { InvalidRequestError } from '@atproto/xrpc-server'
import { AppContext } from '../../../../context'
import { Server } from '../../../../lexicon'
import * as LEX from '../../../../lexicon/lexicons'
import {
  atproto2spicedb,
  checkPermission,
  preflightChecks,
  InvalidRecordError,
} from '../../../../space'
import { assertSpice } from './utils'

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.space.describeSpace({
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
        name: 'repo-read-hour',
        calcKey: ({ auth }) => auth.credentials.did,
        calcPoints: () => 1,
      },
      {
        name: 'repo-read-day',
        calcKey: ({ auth }) => auth.credentials.did,
        calcPoints: () => 1,
      },
    ],
    handler: async ({ params, auth }) => {
      assertSpice(ctx)

      const label = "describeSpace"

      let reqDid: string
      let repoDid: string
      let repoHandle: string
      let spaceId: string

      try {
        var { repo, space } = params

        // more validation, DID resolving, and primary permission checks
        const preflight = await preflightChecks({
          ctx,
          auth,
          // the space we embed in
          repo,
          space,
          collection: LEX.ids.ComAtprotoSpaceSpace,
          rkey: "self",
          record: {},
        })
        reqDid = preflight.reqDid
        repoDid = preflight.repoDid
        repoHandle = preflight.account.handle ?? INVALID_HANDLE
        spaceId = preflight.space

      } catch (err) {
        if (err instanceof InvalidRecordError
         || err instanceof InvalidRecordKeyError
        ) {
          throw new InvalidRequestError(err.message)
        }
        throw err
      }

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
        permission: LEX.schemaDict.ComAtprotoSpaceDescribeSpace.defs.main["auth"].permission,
        objectType: 'space',
        objectId:  `${atproto2spicedb(repoDid)}/${atproto2spicedb(spaceId)}`,
        collectionOp: LEX.ids.ComAtprotoSpaceDescribeSpace,
      })

      // ok, we can do things now

      // TODO, filter these by permission / access / oauth scopes
      // //    enrich too? (to reduce likely requiests for appview UX)
      const info = await ctx.actorStore.read(repoDid, async (store) => {
        return {
          spaces: await store.space.listSpaces(spaceId),
          groups: await store.space.listGroups(spaceId),
          collections: await store.space.listCollections(spaceId),
        }
      })

      return {
        encoding: 'application/json',
        body: {
          ...info,
          handle: repoHandle,

          // handleIsCorrect,
        },
      }
    },
  })
}
