import { AtpAgent, AtUri } from '@atproto/api'

import config from './config';
import { lookupDIDs } from './util';

(async () => {

  const pprint = (msg, data) => {
    console.log(msg, JSON.stringify(data, null, "  "))
  }

  // get DIDs
  const dids = await lookupDIDs(["alice.test", "boris.test", "darth.test"])
  console.log("DIDS:", dids)

  // Init the agent / identity resolver
  const alice = new AtpAgent({ service: config.pdsDomain })
  await alice.login({
    identifier: "alice.test",
    password: "hunter2",
  })

  // create a bubble
  const createBubbleResp = await alice.com.atproto.space.createSpace({
    parent: "root",
    repo: dids[0],
    rkey: "paid",
    record: {
      bubble: true,
      name: "paid"
    }
  })
  pprint("createBubbleResp:", createBubbleResp)

  //
  // intital content
  //

  // create a record
  const createRecordResp = await alice.com.atproto.space.createRecord({
    repo: dids[0],
    parent: "paid",
    record: {
      text: "Never let anyone drive you crazy; it is nearby anyway and the walk is good for you."
    }
  },{
    qp: { collection: "land.wonder.rabbit.hole" },
  })
  pprint("createRecordResp:", createRecordResp)

  // get a record
  const getRecordResp = await alice.com.atproto.space.getRecord({
    repo: dids[0],
    parent: "paid",
    collection: "land.wonder.rabbit.hole",
    rkey: new AtUri(createRecordResp.data.uri).rkey
  })
  pprint("getRecordResp:", getRecordResp)

  // create a record
  const createRecordResp2 = await alice.com.atproto.space.createRecord({
    repo: dids[0],
    parent: "paid",
    record: {
      text: "When you've understood this scripture, throw it away. If you can't understand this scripture, throw it away. I insist on your freedom."
    }
  },{
    qp: { collection: "land.wonder.rabbit.hole" },
  })
  pprint("createRecordResp2:", createRecordResp2)

  // list records
  const listRecordsResp = await alice.com.atproto.space.listRecords({
    repo: dids[0],
    parent: "paid",
    collection: "land.wonder.rabbit.hole",
    limit: 10,
  })
  pprint("listRecordsResp:", listRecordsResp)


  //
  // read-only through a group
  //

  // create a group
  const createGroupResp = await alice.com.atproto.space.createGroup({
    parent: "paid",
    repo: dids[0],
    rkey: "subs",
    record: {
      name: "subs"
    }
  })
  pprint("createGroupResp:", createGroupResp)

  // add member to the group






  console.log("\nFIN")



})();
