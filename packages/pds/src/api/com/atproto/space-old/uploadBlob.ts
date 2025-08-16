import { DAY } from '@atproto/common'
import {
  AuthRequiredError,
  UpstreamTimeoutError,
  parseReqEncoding,
} from '@atproto/xrpc-server'
import { BlobMetadata } from '../../../../actor-store/blob/transactor'
import { AppContext } from '../../../../context'
import { Server } from '../../../../lexicon'

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.space.uploadBlob({
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
    // from repo.uploadBlob
    // rateLimit: {
    //   durationMs: DAY,
    //   points: 1000,
    // },
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
    handler: async ({ auth, input, params }) => {
      // check that spice is available
      if (!ctx.spicedbClient) {
        throw new Error('SpiceDB client not initialized, spaces are unavailable')
      }

      const { repo } = params
      const reqDid = auth.credentials.did

      const account = await ctx.authVerifier.findAccount(repo, {
        checkDeactivated: true,
        checkTakedown: true,
      })

      const did = account.did
      if (did !== reqDid) {
        throw new AuthRequiredError()
      }

      const requester = auth.credentials.did

      const blob = await ctx.actorStore.writeNoTransaction(
        requester,
        async (store) => {
          let metadata: BlobMetadata
          try {
            metadata = await store.repo.blob.uploadBlobAndGetMetadata(
              input.encoding,
              input.body,
            )
          } catch (err) {
            if (err?.['name'] === 'AbortError') {
              throw new UpstreamTimeoutError(
                'Upload timed out, please try again.',
              )
            }
            throw err
          }

          return store.transact(async (actorTxn) => {
            const blobRef =
              await actorTxn.repo.blob.trackUntetheredBlob(metadata)

            // make the blob permanent if an associated record is already indexed
            const recordsForBlob = await actorTxn.repo.blob.getRecordsForBlob(
              blobRef.ref,
            )
            if (recordsForBlob.length > 0) {
              await actorTxn.repo.blob.verifyBlobAndMakePermanent({
                cid: blobRef.ref,
                mimeType: blobRef.mimeType,
                size: blobRef.size,
                constraints: {},
              })
            }

            return blobRef
          })
        },
      )

      return {
        encoding: 'application/json',
        body: {
          blob,
          space: 'space',
        },
      }
    },
  })
}
