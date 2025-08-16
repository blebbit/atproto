import { AtUri } from '@atproto/syntax'
import { AuthRequiredError, InvalidRequestError } from '@atproto/xrpc-server'
import { AppContext } from '../../../../context'
import { Server } from '../../../../lexicon'

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.space.listRecords({
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
      // check that spice is available
      if (!ctx.spicedbClient) {
        throw new Error('SpiceDB client not initialized, spaces are unavailable')
      }

      const { repo, collection, limit = 50, cursor, reverse = false } = params
      const reqDid = auth.credentials.did

      const account = await ctx.authVerifier.findAccount(repo, {
        checkDeactivated: true,
        checkTakedown: true,
      })

      const did = account.did
      if (did !== reqDid) {
        throw new AuthRequiredError()
      }

      const records = await ctx.actorStore.read(did, (store) =>
        store.record.listRecordsForCollection({
          collection,
          limit,
          reverse,
          cursor,
        }),
      )

      const lastRecord = records.at(-1)
      const lastUri = lastRecord && new AtUri(lastRecord?.uri)

      return {
        encoding: 'application/json',
        body: {
          records,
          // Paginate with `before` by default, paginate with `after` when using `reverse`.
          cursor: lastUri?.rkey,
        },
      }
    },
  })
}
