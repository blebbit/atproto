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
const id = 'com.atproto.space.describeRepo'

export type QueryParams = {
  /** The handle or DID of the repo. */
  repo: string
}
export type InputSchema = undefined

export interface OutputSchema {
  /** List of all the spaces and/or collections for which this requester has some permission for. */
  spaces: string[]
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

export interface Space {
  $type?: 'com.atproto.space.describeRepo#space'
  space?: string
  collections?: string[]
}

const hashSpace = 'space'

export function isSpace<V>(v: V) {
  return is$typed(v, id, hashSpace)
}

export function validateSpace<V>(v: V) {
  return validate<Space & V>(v, id, hashSpace)
}
