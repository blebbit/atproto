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
const id = 'com.atproto.space.deleteRecord'

export type QueryParams = {
  /** The NSID of the record type. */
  collection?: string
}

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

export class RecordNotFoundError extends XRPCError {
  constructor(src: XRPCError) {
    super(src.status, src.error, src.message, src.headers, { cause: src })
  }
}

export class InvalidSwapError extends XRPCError {
  constructor(src: XRPCError) {
    super(src.status, src.error, src.message, src.headers, { cause: src })
  }
}

export function toKnownErr(e: any) {
  if (e instanceof XRPCError) {
    if (e.error === 'RecordNotFound') return new RecordNotFoundError(e)
    if (e.error === 'InvalidSwap') return new InvalidSwapError(e)
  }

  return e
}
