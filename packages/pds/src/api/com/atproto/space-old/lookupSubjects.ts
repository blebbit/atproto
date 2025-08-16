import { AtUri, INVALID_HANDLE } from '@atproto/syntax'
import { InvalidRecordKeyError } from '@atproto/syntax'
import { InvalidRequestError } from '@atproto/xrpc-server'
import { AppContext } from '../../../../context'
import { Server } from '../../../../lexicon'
import * as LEX from '../../../../lexicon/lexicons'
import {
  atproto2spicedb,
  aturi2spicedb,
  checkPermission,
  preflightChecks,
  InvalidRecordError,
} from '../../../../space'
import {
  lookupSubjects as spicedbLookupSubjects,
} from '../../../../authz/spicedb'
import { assertSpice } from './utils'

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.space.lookupSubjects({
    auth: ctx.authVerifier.authorization({
      authorize: () => {
        // Performed in the handler
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

      const { repo, space, object, permission } = params
      const reqDid = auth.credentials.did

      try {
        const objectUri = new AtUri(object)

        const preflight = await preflightChecks({
          ctx,
          auth,
          repo,
          space,
          collection: objectUri.collection,
          rkey: objectUri.rkey,
          record: {},
        })

        const repoDid = preflight.repoDid
        const spaceId = preflight.space

        if (repoDid !== objectUri.hostname) {
          throw new InvalidRequestError(
            'Repo in object URI does not match repo parameter',
          )
        }

        const resourceSid = aturi2spicedb(
          `${repoDid}/${objectUri.collection}/${objectUri.rkey}?space=${spaceId}`,
        )
        const objectType = resourceSid.split(':')[0]

        await checkPermission({
          spicedbClient: ctx.spicedbClient,
          auth,
          subjectType: 'user',
          subjectId: atproto2spicedb(reqDid),
          permission:
            LEX.schemaDict.ComAtprotoSpaceLookupSubjects.defs.main['auth']
              .permission,
          objectType: objectType,
          objectId: resourceSid,
          collectionOp: LEX.ids.ComAtprotoSpaceLookupSubjects,
        })

        const subjects = await spicedbLookupSubjects(
          ctx.spicedbClient,
          resourceSid,
          permission,
          'user',
        )

        return {
          encoding: 'application/json',
          body: {
            subjects: subjects.map((s) => s.subject.objectId),
          },
        }
      } catch (err) {
        if (
          err instanceof InvalidRecordError ||
          err instanceof InvalidRecordKeyError
        ) {
          throw new InvalidRequestError(err.message)
        }
        throw err
      }
    },
  })
}