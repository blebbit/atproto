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
const id = 'com.atproto.space.lookupSubjects'

export type QueryParams = {
  /** The handle or DID of the repo. */
  repo: string
  /** The id of the space associated with the repo. */
  space: string
  /** The object id. */
  object: string
  /** The required permission. */
  permission: string
}
export type InputSchema = undefined

export interface OutputSchema {
  /** List of all the subjects that have the given permission on the object. */
  subjects: string[]
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
