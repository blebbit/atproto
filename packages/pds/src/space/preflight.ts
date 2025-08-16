import { AppContext } from '../context'
import { Server } from '../lexicon'

import { InvalidRecordKeyError } from '@atproto/syntax'
import {
  AuthRequiredError,
  HandlerContext,
  HandlerInput,
  InvalidRequestError,
} from '@atproto/xrpc-server'

import * as spice from '../authz/spicedb'

import { aturi2spicedb } from './format'
import { sanitize } from './sanitize'

export async function preflightIdentity({
  ctx,
  auth,
  repo,
}:{
  ctx: AppContext,
  auth: any,
  repo: string,
}) {
  // check that spice is available
  if (!ctx.spicedbClient) {
    throw new Error('SpiceDB client not initialized, spaces are unavailable')
  }

  // check that we have some auth for the requestor to work with
  if (!auth.credentials.did) {
    throw new AuthRequiredError()
  }
  // TODO, we need to be smarter here to know what type the requester is
  // do we also need to know both the reqDid AND the oauthId, apikey, etc...
  const reqDid = auth.credentials.did
  // END TODO


  // lookup the account that owns the space
  const account = await ctx.authVerifier.findAccount(repo, {
    checkDeactivated: true,
    checkTakedown: true,
  })
  const repoDid = account.did

  return {
    reqDid,
    repoDid,
    account,
  }
}

export async function preflightChecks({
  // app related
  ctx,
  auth,
  // user input
  repo,
  space,
  collection,
  rkey,
  record,
  // required permissions
  objectType,
  permission,
  subjectType,
}:{
  // app related
  ctx: AppContext,
  auth: any,
  // user input
  repo: string,
  space?: string
  collection: any, // this is really an NSID, covers records, queries, procedures, etc.
  rkey?: any,
  record?: any,
  // required permissions
  objectType: string,
  permission: any,
  subjectType: string,
}) {
  // check that spice is available
  if (!ctx.spicedbClient) {
    throw new Error('SpiceDB client not initialized, spaces are unavailable')
  }

  //
  // TODO, consider splitting this function up
  //

  const { reqDid, repoDid, account } = await preflightIdentity({
    ctx,
    auth,
    repo
  })

  // set some defaults
  if (!space || space.length < 1) {
    space = repoDid
  }

  // sanitize some inputs
  await sanitize({
    repo: repoDid,
    space,
    collection,
    rkey,
    record,
  })

  //
  // check permissions / authorization
  //
  let authzOk = false

  // the requester trying to perform the action
  const subject = `${subjectType}:${aturi2spicedb(reqDid)}`

  // the space the requester is acting within
  const resource = `${objectType}:${aturi2spicedb(`${repoDid}/com.atproto.space.space/${space}`)}`
  // TODO, also check they have permissiions over the collection / nsid in the repo

  // "pretty" print
  const spiceFmt = `${resource}#${permission}@${subject}`
  try {
    console.log(`checking: ${spiceFmt}`)
    const r = await spice.checkPermission(ctx.spicedbClient, resource, permission, subject)
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
      collection,
    })
  }

  if (!authzOk) {
    throw new AuthRequiredError(
      `You do not have permission to ${spiceFmt}.`,
    )
  }

  return {
    account,
    reqDid,
    repoDid,
    space,
    rkey,
  }
}
