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
const id = 'com.atproto.space.listGroups'

export type QueryParams = {
  /** The handle or DID of the repo. */
  repo: string
  /** The id of the space associated with the repo. */
  space: string
  /** The number of records to return. */
  limit?: number
  cursor?: string
  /** Flag to reverse the order of the returned records. */
  reverse?: boolean
}
export type InputSchema = undefined

export interface OutputSchema {
  cursor?: string
  groups: Group[]
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

export interface Group {
  $type?: 'com.atproto.space.listGroups#group'
  uri: string
  cid: string
  value: { [_ in string]: unknown }
}

const hashGroup = 'group'

export function isGroup<V>(v: V) {
  return is$typed(v, id, hashGroup)
}

export function validateGroup<V>(v: V) {
  return validate<Group & V>(v, id, hashGroup)
}
