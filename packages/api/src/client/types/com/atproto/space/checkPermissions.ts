/**
 * GENERATED CODE - DO NOT MODIFY
 */
import { HeadersMap, XRPCError } from '@atproto/xrpc'
import { type ValidationResult, BlobRef } from '@atproto/lexicon'
import { CID } from 'multiformats/cid'
import { validate as _validate } from '../../../../lexicons'
import {
  type $Typed,
  is$typed as _is$typed,
  type OmitKey,
} from '../../../../util'

const is$typed = _is$typed,
  validate = _validate
const id = 'com.atproto.space.checkPermissions'

export type QueryParams = {
  /** The resource type [space,record,etc] */
  resourceType: string
  /** List of object ids to see if subject is granted the permission. */
  resources: string[]
  /** possible values are defined in the spicedb schema and depend on context */
  permission: string
  /** the subject type [user,group,etc] */
  subjectType: string
  /** the subject id to grant */
  subject: string
  /** nsids: { allowed: map<bool>, default bool, nsid string } */
  caveats?: string
  /** The Zanzibar/SpiceDB consistency token, very similar in intent to CIDs in ATProto. */
  zookie?: string
}
export type InputSchema = undefined

export interface OutputSchema {
  /** List ordered the same as input objects, with allowed status. */
  allowed: string[]
}

export interface CallOptions {
  signal?: AbortSignal
  headers?: HeadersMap
}

export interface Response {
  success: boolean
  headers: HeadersMap
  data: OutputSchema
}

export function toKnownErr(e: any) {
  return e
}
