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
  lookupResources as spicedbLookupResources,
} from '../../../../authz/spicedb'
import { assertSpice } from './utils'

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.space.lookupResources({
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

      const { repo, space, subject, permission } = params
      const reqDid = auth.credentials.did

      try {
        const subjectUri = new AtUri(subject)

        const preflight = await preflightChecks({
          ctx,
          auth,
          repo,
          space,
          collection: subjectUri.collection,
          rkey: subjectUri.rkey,
          record: {},
        })

        const repoDid = preflight.repoDid
        const spaceId = preflight.space

        if (repoDid !== subjectUri.hostname) {
          throw new InvalidRequestError(
            'Repo in subject URI does not match repo parameter',
          )
        }

        const subjectSid = aturi2spicedb(
          `${repoDid}/${subjectUri.collection}/${subjectUri.rkey}?space=${spaceId}`,
        )
        const subjectType = subjectSid.split(':')[0]

        await checkPermission({
          spicedbClient: ctx.spicedbClient,
          auth,
          subjectType: 'user',
          subjectId: atproto2spicedb(reqDid),
          permission:
            LEX.schemaDict.ComAtprotoSpaceLookupResources.defs.main['auth']
              .permission,
          objectType: subjectType,
          objectId: subjectSid,
          collectionOp: LEX.ids.ComAtprotoSpaceLookupResources,
        })

        const resources = await spicedbLookupResources(
          ctx.spicedbClient,
          subjectSid,
          permission,
          '*',
        )

        return {
          encoding: 'application/json',
          body: {
            objects: resources.map((r) => r.resourceId),
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