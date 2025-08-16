import { AtUri } from '@atproto/syntax'
import { AuthRequiredError, InvalidRequestError } from '@atproto/xrpc-server'
import { AppContext } from '../../../../context'
import { Server } from '../../../../lexicon'
import { pipethrough } from '../../../../pipethrough'

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.space.getRecord({
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
    handler: async ({ req, params, auth }) => {
      // check that spice is available
      if (!ctx.spicedbClient) {
        throw new Error('SpiceDB client not initialized, spaces are unavailable')
      }

      const { repo, collection, rkey, cid } = params
      const reqDid = auth.credentials.did

      const account = await ctx.authVerifier.findAccount(repo, {
        checkDeactivated: true,
        checkTakedown: true,
      })

      const did = account.did
      if (did !== reqDid) {
        throw new AuthRequiredError()
      }

      // fetch from pds if available, if not then fetch from appview
      if (did) {
        const uri = AtUri.make(did, collection, rkey)
        const record = await ctx.actorStore.read(did, (store) =>
          store.record.getRecord(uri, cid ?? null),
        )
        if (!record || record.takedownRef !== null) {
          throw new InvalidRequestError(
            `Could not locate record: ${uri}`,
            'RecordNotFound',
          )
        }
        return {
          encoding: 'application/json',
          body: {
            uri: uri.toString(),
            cid: record.cid,
            value: record.value,
          },
        }
      }

      if (!ctx.cfg.bskyAppView) {
        throw new InvalidRequestError(`Could not locate record`)
      }

      return pipethrough(ctx, req)
    },
  })
}
