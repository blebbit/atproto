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
const id = 'com.atproto.space.lookupResources'

export type QueryParams = {
  /** The handle or DID of the repo. */
  repo: string
  /** The id of the space associated with the repo. */
  space: string
  /** the subject id. */
  subject: string
  /** The required permission. */
  permission: string
}
export type InputSchema = undefined

export interface OutputSchema {
  /** List of all the objects the subject has the given permission on. */
  objects: string[]
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
