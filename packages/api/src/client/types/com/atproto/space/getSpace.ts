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
const id = 'com.atproto.space.getSpace'

export type QueryParams = {
  /** The handle or DID of the repo (aka, current account). */
  repo: string
  /** The id of the context space to operate under. */
  parent?: string
  /** The id of the space. */
  rkey: string
  /** The CID of the version of the resource. If not specified, then return the most recent version. */
  cid?: string
  /** The Zanzibar/SpiceDB consistency token, very similar in intent to CIDs in ATProto. */
  zookie?: string
}
export type InputSchema = undefined

export interface OutputSchema {
  uri: string
  /** The CID of the resource. */
  cid?: string
  /** Some value, lexicon and implementation dependent. */
  value: { [_ in string]: unknown }
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
