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
    space = 'root'
  }
  if (!rkey) {
    rkey = ctx.genCuid["16"]()
  }

  // sanitize some inputs
  await sanitize({
    repo: repoDid,
    space,
    collection,
    rkey,
    record,
  })

  return {
    account,
    reqDid,
    repoDid,
    space,
    rkey,
  }
}
