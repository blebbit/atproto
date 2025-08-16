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
const id = 'com.atproto.space.listSpaces'

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
  /** The Zanzibar/SpiceDB consistency token, very similar in intent to CIDs in ATProto. */
  zookie?: string
}
export type InputSchema = undefined

export interface OutputSchema {
  cursor?: string
  spaces: Record[]
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
  $type?: 'com.atproto.space.listSpaces#record'
  uri: string
  /** The CID of the resource. */
  cid: string
  /** Some value, lexicon and implementation dependent. */
  value: { [_ in string]: unknown }
}

const hashRecord = 'record'

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord)
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord)
}
