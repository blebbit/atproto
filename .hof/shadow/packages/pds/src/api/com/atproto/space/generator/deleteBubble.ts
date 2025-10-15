// @ts-nocheck

import { InvalidRecordKeyError } from "@atproto/syntax";
import { InvalidRequestError } from "@atproto/xrpc-server";
import { AppContext } from "../../../../context";
import { Server } from "../../../../lexicon";
import * as LEX from "../../../../lexicon/lexicons";
import { createRelationship } from "../../../../authz/spicedb";
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
} from "../../../../space";
import { ActorStoreTransactor } from "../../../../actor-store/actor-store-transactor";
import { assertSpice } from "./utils";

// <no value>

export default function (server: Server, ctx: AppContext) {
  server.com.atproto.space.deleteBubble({
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
        name: "repo-write-hour",
        calcKey: ({ auth }) => auth.credentials.did,
        calcPoints: () => 3,
      },
      {
        name: "repo-write-day",
        calcKey: ({ auth }) => auth.credentials.did,
        calcPoints: () => 3,
      },
    ],

    handler: async ({ auth, input }) => {
      assertSpice(ctx);

      const label = "deleteBubble";

      let space: string;
      let reqDid: string;
      let repoDid: string;

      try {
        // deconstruct body
        console.log(`${label}.input:`, input);
        var { repo, rkey, swapCid, zookie } = input.body;

        // validation ... add as needed

        // more validation, DID resolving
        const preflight = await preflightChecks({
          ctx,
          auth,
          // the space we embed in
          repo,
          space: "<change-me>",
          collection: "<change-me>",
          rkey: rkey,
          record: {},
        });
        reqDid = preflight.reqDid;
        repoDid = preflight.repoDid;
        space = preflight.space;

        //
        // check permissions
        //

        // TODO, we probably need to look up the "space" to see if it is a space or bubble
        //       you may also want to do the same for any other context that is relevant
        //       to the xrpc handler business logic

        // TODO, support more subject kinds, need to base on auth.credentials.type
        let subjectType = "acct";
        let subjectId = atproto2spicedb(reqDid);

        // what we are checking permission wise? (needs to be set per xrpc handler, perhaps set in the lexicon?)
        // not sure this makes sense as named in the lexicon doc, i.e. group, the objectType is space or bubble
        // can bubble be a boolean on a space, and only different in spicedb?
        let objectType = "bubble";
        // NOTE, you may need to add more path parts to the resource id, for pretty much
        let objectId = `${atproto2spicedb(repoDid)}/${atproto2spicedb(space)}`;

        // TODO, caveats for records, but probably only

        await checkPermission({
          spicedbClient: ctx.spicedbClient,
          auth,
          subjectType,
          subjectId,
          permission: "delete_bubble",
          objectType,
          objectId,
          collectionOp: LEX.ids.ComAtprotoSpaceDeleteBubble,
        });
      } catch (err) {
        if (
          err instanceof InvalidRecordError ||
          err instanceof InvalidRecordKeyError
        ) {
          throw new InvalidRequestError(err.message);
        }
        throw err;
      }

      //
      // Prepare operations here
      //

      // crud record

      // crud relation record

      // crud authz

      //
      // DUAL WRITE PROBLEM
      //
      await dualWriteTransaction({
        ctx,
        repo: repoDid,

        // (DWP/1) writes to the repo database
        actorOps: async (actorTxn: ActorStoreTransactor) => {
          // write to repo sqlite here
        },

        // (DWP/2) writes to the authz service
        authzOps: async (spicedbClient) => {
          // call SpiceDB client here
        },
      });

      // TODO, (DWP/3) background reconciliation process

      // success!
      return {
        encoding: "application/json",
        body: {
          status,
          zookie,
        },
      };
    },
  });
}
