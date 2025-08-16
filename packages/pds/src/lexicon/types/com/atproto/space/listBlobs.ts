/**
 * GENERATED CODE - DO NOT MODIFY
 */
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
const id = 'com.atproto.space.listBlobs'

export type QueryParams = {
  /** The handle or DID of the repo (aka, current account). */
  repo: string
  /** The id of the context space to operate under. */
  parent?: string
  /** The number of records to return. */
  limit: number
  cursor?: string
  /** Flag to reverse the order of the returned records. */
  reverse?: boolean
  /** Optional revision of the repo to list blobs since. (note, createdAt?) */
  since?: string
}
export type InputSchema = undefined

export interface OutputSchema {
  cursor?: string
  blobs: Record[]
}

export type HandlerInput = void

export interface HandlerSuccess {
  encoding: 'application/json'
  body: OutputSchema
  headers?: { [key: string]: string }
}

export interface HandlerError {
  status: number
  message?: string
}

export type HandlerOutput = HandlerError | HandlerSuccess

export interface Record {
  $type?: 'com.atproto.space.listBlobs#record'
  uri: string
  /** The CID of the resource. */
  cid: string
  encoding?: string
  size?: number
}

const hashRecord = 'record'

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord)
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord)
}
