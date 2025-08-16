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
const id = 'com.atproto.space.deleteRole'

export type QueryParams = {}

export interface InputSchema {
  /** The handle or DID of the repo (aka, current account). */
  repo: string
  rkey: string
  /** Compare and swap with the previous record by CID. */
  swapCID?: string
  /** The Zanzibar/SpiceDB consistency token, very similar in intent to CIDs in ATProto. */
  zookie?: string
}

export interface OutputSchema {
  /** a human readable status message */
  status?: string
  /** The Zanzibar/SpiceDB consistency token, very similar in intent to CIDs in ATProto. */
  zookie?: string
}

export interface CallOptions {
  signal?: AbortSignal
  headers?: HeadersMap
  qp?: QueryParams
  encoding?: 'application/json'
}

export interface Response {
  success: boolean
  headers: HeadersMap
  data: OutputSchema
}

export function toKnownErr(e: any) {
  return e
}
