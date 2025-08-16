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
  lookupResources,
  lookupSubjects
} from '../../../../authz/spicedb'
import { assertSpice } from './utils'
import { group } from 'console'

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.space.describeGroup({
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

      const label = "describeGroup"

      let reqDid: string
      let repoDid: string
      let repoHandle: string
      let spaceId: string

      try {
        var { repo, space, rkey } = params

        // more validation, DID resolving, and primary permission checks
        const preflight = await preflightChecks({
          ctx,
          auth,
          // the space we embed in
          repo,
          space,
          collection: LEX.ids.ComAtprotoSpaceGroup,
          rkey: 'self',
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

      const groupSid = aturi2spicedb(`${repoDid}/com.atproto.space.group/${rkey}?space=${spaceId}`)

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
        permission: LEX.schemaDict.ComAtprotoSpaceDescribeGroup.defs.main["auth"].permission,
        objectType: 'group',
        objectId:  groupSid,
        collectionOp: LEX.ids.ComAtprotoSpaceDescribeGroup,
      })

      // ok, we can do things now

      try {
        console.log(`describeGroup.spicedb: ${groupSid}`)

        const mods = await lookupSubjects(ctx.spicedbClient, `group:${groupSid}`, 'delete', 'user')
        console.log(`describeGroup.mods: ${JSON.stringify(mods)}`)
        const members = await lookupSubjects(ctx.spicedbClient, `group:${groupSid}`, 'member', 'user')
        console.log(`describeGroup.members: ${JSON.stringify(members)}`)
        const groups = await lookupSubjects(ctx.spicedbClient, `group:${groupSid}`, 'member', 'group')
        console.log(`describeGroup.groups: ${JSON.stringify(groups)}`)

        const spaces = await lookupResources(ctx.spicedbClient, `group:${groupSid}`, 'read', 'space')
        console.log(`describeGroup.spaces: ${JSON.stringify(spaces)}`)


        return {
          encoding: 'application/json',
          body: {
            hello: 'world',
            hack: {
              mods,
              members,
              groups,
              spaces,
            }
          },
        }

      } catch (err) {
        console.error(err)
        throw err
      }
    },
  })
}
