import { AuthRequiredError } from '@atproto/xrpc-server'
import * as spice from '../authz/spicedb'
import { aturi2spicedb } from './format'

//
// check permissions / authorization
//

export async function checkPermission({
  spicedbClient,
  auth,
  subjectType,
  subjectId,
  permission,
  objectType,
  objectId,
  collectionOp,
}:{
  spicedbClient: any,
  auth: any,
  subjectType: string,
  subjectId: string,
  permission: string,
  objectType: string,
  objectId: string,
  collectionOp: string,
}): Promise<boolean> {
  // our eventual return
  let authzOk = false

  // the requester trying to perform the action
  const subject = `${subjectType}:${subjectId}`
  // const subject = `${subjectType}:${aturi2spicedb(reqDid)}`

  // the space the requester is acting within
  const resource = `${objectType}:${objectId}`
  // const resource = `${objectType}:${aturi2spicedb(`${repoDid}/${collection}/${space}`)}`
  // TODO, also check they have permissiions over the collection / nsid in the repo

  // "pretty" print
  const spiceFmt = `${resource}#${permission}@${subject}`
  try {
    console.log(`checking: ${spiceFmt}`)
    const r = await spice.checkPermission(spicedbClient, resource, permission, subject)
    console.log(`response: ${spiceFmt}\n`, r)
    if (r.allowed === "yes") {
      authzOk = true
    }
  } catch (e) {
    console.error('spicedb checkPermission error', e)
  }

  // also check oauth permissions
  // TODO, we probably need to have a subject type for oauth:... in the spicedb schema
  if (auth.credentials.type === 'oauth') {
    console.log("oauth request, checking scopes")
    // TODO, this probably needs to change or be extended?
    // what if we only want to grant certain oauth scopes on a per-space basis?
    // maybe this is just a quick, granular check
    auth.credentials.permissions.assertRepo({
      action: permission, // this might have to change if we make lexicon permissions have scoeps like space/create or nsid/create
      collection: collectionOp,
    })
  }

  if (!authzOk) {
    throw new AuthRequiredError(
      `You do not have permission to ${spiceFmt}.`,
    )
  }

  return authzOk
}
