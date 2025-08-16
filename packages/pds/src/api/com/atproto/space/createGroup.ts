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
  server.com.atproto.space.createGroup({
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

      const label = "createGroup";

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

      try {
        // deconstruct body
        console.log(`${label}.input:`, input);
        var { parent, record, repo, rkey, validate, zookie } = input.body;

        // validation ... add as needed

        // more validation, DID resolving
        const preflight = await preflightChecks({
          ctx,
          auth,
          // the space we embed in
          repo,
          space: parent,
          collection: "<change-me>",
          rkey: rkey,
          record: record,
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

        // what we are checking permission wise? (needs to be set per xrpc handler, perhaps set in the lexicon?)
        // not sure this makes sense as named in the lexicon doc, i.e. group, the objectType is space or bubble
        // can bubble be a boolean on a space, and only different in spicedb?
        // select one of
        let objectType = currSpaceType;
        // let objectType = "space";
        // NOTE, you may need to add more path parts to the resource id, for pretty much
        let objectId = `${repoDidSid}/${currSpaceSid}`;

        // TODO, caveats for records, but probably only

        await checkPermission({
          spicedbClient: ctx.spicedbClient,
          auth,
          subjectType: reqSubjectType,
          subjectId: reqDidSid,
          permission: "group_create",
          objectType,
          objectId,
          collectionOp: LEX.ids.ComAtprotoSpaceCreateGroup,
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
      if (!rkey) {
        rkey = ctx.genCuid["16"]()
      }
      const rkeySid = atproto2spicedb(rkey)

      // main record(s)

      // (self): prepare a write for the new space record
      // rkey and space are a bit convoluted for the space's self record
      // This should be optional, and perhaps the caller should inform the rkey
      // so they can pair creating a new space with the semantic record that goes with it
      // (in case multiple apps want to store "self" semantic records)?
      // or do they just do two writes? (for now?)
      const mainRecord = await prepareCreate({
        reqDid,
        repoDid,
        space: reqSpace,
        collection: LEX.ids.ComAtprotoSpaceGroup,
        rkey,
        record,
        validate,
      })

      // relation record(s)

      // crud relation record
      // relation values we will write to the repo & authz along with the record
      // NOTE, need to use the "full" URI here for both subject & resource
      // ... but not the space query param, that is what we are capturing here
      // subject is the parent space, resource is the new space
      const parentSid = `${currSpaceType}:${repoDidSid}/${currSpaceSid}`
      const relation = 'parent'
      const newResourceSid = `group:${repoDidSid}/${currSpaceSid}/${atproto2spicedb(LEX.ids.ComAtprotoSpaceGroup)}/${rkeySid}`

      // (owner/parent): prepare a write for the relationship record
      const parentRelation = await prepareCreate({
        reqDid,
        repoDid,
        space: mainRecord.uri.space,
        collection: LEX.ids.ComAtprotoSpaceRelation,
        rkey: ctx.genCuid['16'](),
        record: {
          resource: newResourceSid,
          relation,
          subject: parentSid,
        },
      })

      //
      // DUAL WRITE PROBLEM
      //

      // vars filled during transaction
      var newZookie = "???"

      // run transaction
      await dualWriteTransaction({
        ctx,
        repo: repoDid,

        // (DWP/1) writes to the repo database
        actorOps: async (actorTxn: ActorStoreTransactor) => {
          // read/write to repo sqlite here

          // group record
          // console.log("writing spaceRecord", JSON.stringify(spaceRecord, null, "  "))
          // the actor-store does not have a create vs update function, just insert
          await actorTxn.space.insertRecord({
            uri: mainRecord.uri,
            parent: reqSpace,
            record: mainRecord.record,
            reqDid,
          })

          // space (owner/parent) relation record
          // console.log("writing spaceRelation", JSON.stringify(parentRelation, null, "  "))
          await actorTxn.space.insertRecord({
            uri: parentRelation.uri,
            parent: parentRelation.parentUri.toString(),
            record: parentRelation.record,
            reqDid,
          })
        },

        // (DWP/2) writes to the authz service
        authzOps: async (spicedbClient) => {
          // call SpiceDB client here
          const r = await touchRelationship(spicedbClient, newResourceSid, relation, parentSid)
          newZookie = r.writtenAt.token;
        },
      });

      // TODO, (DWP/3) background reconciliation process

      // success!
      const body = {
        cid: mainRecord.cid.toString(),
        status: "ok",
        uri: mainRecord.uri.toString(),
        validationStatus: mainRecord.validationStatus,
        zookie: newZookie,
      };
      console.log("resp.body", JSON.stringify(body, null, "  "));
      return {
        encoding: "application/json",
        body,
      };
    },
  });
}
