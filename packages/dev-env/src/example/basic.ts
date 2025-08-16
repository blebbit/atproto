import { AtpAgent, AtUri } from '@atproto/api'
import { IdResolver } from '@atproto/identity';

import config from './config';

(async () => {

  const pprint = (msg, data) => {
    console.log(msg, JSON.stringify(data, null, "  "))
  }

  const handle = "alice.test"
  const password = "hunter2"

  console.log("PLC:    ", config.plcDomain)
  console.log("PDS:    ", config.pdsDomain)
  console.log("Handle: ", handle)


  // Init the agent / identity resolver
  const agent = new AtpAgent({ service: config.pdsDomain })
  const idr = new IdResolver({
    plcUrl: config.plcDomain
  })

  // Handle -> DID
  const r = await agent.resolveHandle({
    handle,
  })
  const did = r.data.did
  console.log("DID:    ", did)

  // DID -> Doc & PDS
  const doc: any = await idr.did.resolve(did as string)
  pprint("Doc:", doc)
  const pds = doc["service"]?.filter(s => s.id === "#atproto_pds")[0].serviceEndpoint
  console.log("PDS:    ", pds)

  // print describeRepo
  const repo = await agent.com.atproto.repo.describeRepo({
    repo: did as string
  })
  pprint("Repo:", repo.data)

  // login acct with PDS
  // const session =
  await agent.login({
    identifier: handle as string,
    password: password as string,
  })
  // console.log("Session:", JSON.stringify(session.data, null, "  "))

  // get alice's root space
  const rootValue = await agent.com.atproto.space.getSpace({
    repo: did as string,
    rkey: "root",
  })
  pprint("Root Value:", rootValue.data)
  const rootDescr = await agent.com.atproto.space.describeSpace({
    repo: did as string,
    rkey: "root",
  })
  pprint("Root Descr:", rootDescr.data)

  // create a space
  const createSpaceResp = await agent.com.atproto.space.createSpace({
    parent: "root",
    repo: did as string,
    rkey: "bsky",
    record: {
      name: "bsky"
    }
  })
  pprint("createSpaceResp:", createSpaceResp)

  // print some final info
  const rootDescrPost = await agent.com.atproto.space.describeSpace({
    repo: did as string,
    rkey: "root",
  })
  pprint("Root DescrPost:", rootDescrPost.data)

  // create a record
  const createRecordResp = await agent.com.atproto.space.createRecord({
    repo: did as string,
    parent: "bsky",
    record: {
      text: "Never let anyone drive you crazy; it is nearby anyway and the walk is good for you."
    }
  },{
    qp: { collection: "land.wonder.rabbit.hole" },
  })
  pprint("createRecordResp:", createRecordResp)

  // get a record
  const getRecordResp = await agent.com.atproto.space.getRecord({
    repo: did as string,
    parent: "bsky",
    collection: "land.wonder.rabbit.hole",
    rkey: new AtUri(createRecordResp.data.uri).rkey
  })
  pprint("getRecordResp:", getRecordResp)

  // create a record
  const createRecordResp2 = await agent.com.atproto.space.createRecord({
    repo: did as string,
    parent: "bsky",
    record: {
      text: "When you've understood this scripture, throw it away. If you can't understand this scripture, throw it away. I insist on your freedom."
    }
  },{
    qp: { collection: "land.wonder.rabbit.hole" },
  })
  pprint("createRecordResp2:", createRecordResp2)

  // list records
  const listRecordsResp = await agent.com.atproto.space.listRecords({
    repo: did as string,
    collection: "land.wonder.rabbit.hole",
    parent: "bsky",
    limit: 10,
  })
  pprint("listRecordsResp:", listRecordsResp)

  console.log("\nFIN")

})();
