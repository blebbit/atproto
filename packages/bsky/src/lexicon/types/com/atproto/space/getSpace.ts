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
const id = 'com.atproto.space.getSpace'

export type QueryParams = {
  /** The handle or DID of the repo. */
  repo: string
  /** The id of the space associated with the repo. */
  space: string
  /** The CID of the version of the space. If not specified, then return the most recent version. */
  cid?: string
}
export type InputSchema = undefined

export interface OutputSchema {
  uri: string
  cid?: string
  value: { [_ in string]: unknown }
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
  error?: 'RecordNotFound'
}

export type HandlerOutput = HandlerError | HandlerSuccess
