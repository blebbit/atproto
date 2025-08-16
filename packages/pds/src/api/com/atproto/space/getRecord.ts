import { InvalidRecordKeyError } from "@atproto/syntax";
import { InvalidRequestError } from "@atproto/xrpc-server";
import { AppContext } from "../../../../context";
import { Server } from "../../../../lexicon";
import * as LEX from "../../../../lexicon/lexicons";
import { AtUri } from "@atproto/syntax";
import { touchRelationship } from "../../../../authz/spicedb";
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
        name: "repo-read-hour",
        calcKey: ({ auth }) => auth.credentials.did,
        calcPoints: () => 1,
      },
      {
        name: "repo-read-day",
        calcKey: ({ auth }) => auth.credentials.did,
        calcPoints: () => 1,
      },
    ],

    handler: async ({ auth, params }) => {
      assertSpice(ctx);

      const label = "getRecord";

      // from request
      let reqDid: string;
      let reqDidSid: string;
      let reqSpace: string;
      let repoDid: string;
      let repoDidSid: string;

      // from database
      let currSpaceRecord: any = null;
      let currSpace: string;
      let currSpaceSid: string;
      let currSpaceType: string = "invalid";
      let collectionSid: string
      let rkeySid: string

      try {
        // deconstruct params
        console.log(`${label}.params:`, params);
        var { cid, collection, parent, repo, rkey, zookie } = params;

        // validation ... add as needed

        // more validation, DID resolving
        const preflight = await preflightChecks({
          ctx,
          auth,
          // the space we embed in
          repo,
          space: parent,
          collection: collection,
          rkey: rkey,
          record: {},
        });
        reqDid = preflight.reqDid;
        repoDid = preflight.repoDid;
        reqSpace = preflight.space;
        rkey = preflight.rkey;

        //
        // check permissions
        //

        // we need to look up the "space" to see if it is a space or bubble
        // you may also want to do the same for any other context that is relevant
        // to the xrpc handler business logic
        await ctx.actorStore.read(repoDid, async (reader) => {
          const suri = AtUri.make(
            repoDid,
            "com.atproto.space.space",
            "self",
            reqSpace,
          );
          currSpaceRecord = await reader.space.getRecord(suri, null);
        });
        if (currSpaceRecord === null) {
          // return error
          // TODO ensure we return similar errors
          throw new InvalidRequestError(
            "unauthenticated, insufficient permissions, or unknown parent",
          );
        }
        console.log(
          "currSpace.space:",
          JSON.stringify(currSpaceRecord, null, "  "),
        );
        currSpaceType = currSpaceRecord.value.bubble ? "bubble" : "space";

        // TODO, support more subject kinds, need to base on auth.credentials.type
        let reqSubjectType = "acct";
        reqDidSid = atproto2spicedb(reqDid);
        repoDidSid = atproto2spicedb(repoDid);
        currSpaceSid = atproto2spicedb(reqSpace);
        collectionSid = atproto2spicedb(collection as string);
        rkeySid = atproto2spicedb(rkey);

        // what we are checking permission wise? (needs to be set per xrpc handler, perhaps set in the lexicon?)
        // not sure this makes sense as named in the lexicon doc, i.e. group, the objectType is space or bubble
        // can bubble be a boolean on a space, and only different in spicedb?
        // select one of
        // let objectType = currSpaceType;
        let objectType = "record";
        // NOTE, you may need to add more path parts to the resource id, for pretty much
        let objectId = `${repoDidSid}/${currSpaceSid}/${collectionSid}/${rkeySid}`;

        // TODO, caveats for records, but probably only

        await checkPermission({
          spicedbClient: ctx.spicedbClient,
          auth,
          subjectType: reqSubjectType,
          subjectId: reqDidSid,
          permission: "record_get",
          objectType,
          objectId,
          collectionOp: LEX.ids.ComAtprotoSpaceGetRecord,
          // TODO, pass zookie (and consistency mode?)
          // TODO, pass caveats? (maybe only needed on com.atproto.space.record)
        });
      } catch (err) {
        console.error(err);
        if (
          err instanceof InvalidRecordError ||
          err instanceof InvalidRecordKeyError
        ) {
          throw new InvalidRequestError(
            "unauthenticated, insufficient permissions, or unknown parent",
          );
          // throw new InvalidRequestError(err.message)
        }
        throw err;
      }

      //
      // Prepare operations here
      //

      // default value(s)
      // self record at-uri
      // rkey param here is the name of the space, and the record for the space is always "self"
      const aturi = AtUri.make(repo, collection, rkey, reqSpace)
      const uri = aturi.toString()

      // main record(s)

      // relation record(s)

      //
      // DUAL WRITE PROBLEM
      //

      // vars filled during transaction
      var value: any = {}

      // run transaction
      // read-only from repo sqlite here
      await ctx.actorStore.transact(repo, async (actorTxn) => {
        value = await actorTxn.space.getRecord(aturi, cid || null)
      })

      // todo, check value, respond appropriately if not found

      // success!
      const body = {
        cid,
        uri,
        value,
      };
      console.log("resp.body", JSON.stringify(body, null, "  "));
      return {
        encoding: "application/json",
        body,
      };
    },
  });
}
