/**
 * GENERATED CODE - DO NOT MODIFY
 */
import stream from 'node:stream'
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
const id = 'com.atproto.space.uploadBlob'

export type QueryParams = {
  /** The handle or DID of the repo (aka, current account). */
  repo: string
  /** The id of the context space to operate under. */
  space: string
}
export type InputSchema = string | Uint8Array | Blob

export interface OutputSchema {
  uri: string
  cid: string
  validationStatus?: 'valid' | 'unknown' | (string & {})
  /** a human readable status message */
  status?: string
}

export interface HandlerInput {
  encoding: '*/*'
  body: stream.Readable
}

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
