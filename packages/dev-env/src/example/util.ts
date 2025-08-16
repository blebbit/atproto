import { AtpAgent } from '@atproto/api'

import config from './config';


export async function lookupDIDs(handles: string[]) {
  const agent = new AtpAgent({ service: config.pdsDomain })

  var dids: string[] = []
  for (const handle of handles) {
    const r = await agent.resolveHandle({
      handle,
    })
    dids.push(r.data.did)
  }

  return dids
}
