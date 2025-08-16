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
const id = 'com.atproto.space.createGroup'

export type QueryParams = {}

export interface InputSchema {
  /** The handle or DID of the repo (aka, current account). */
  repo: string
  /** The id of the parent space to nest under. If not set, the current value or /root is assumed. Can be used to move a space or bubble. */
  parent?: string
  /** The id of the space associated with the repo. */
  rkey?: string
  /** The record itself. Must contain a $type field. */
  record: { [_ in string]: unknown }
  /** Can be set to 'false' to skip Lexicon schema validation of record data, 'true' to require it, or leave unset to validate only for known Lexicons. */
  validate?: boolean
  /** The Zanzibar/SpiceDB consistency token, very similar in intent to CIDs in ATProto. */
  zookie?: string
}

export interface OutputSchema {
  uri: string
  cid: string
  /** The Zanzibar/SpiceDB consistency token, very similar in intent to CIDs in ATProto. */
  zookie?: string
  validationStatus?: 'valid' | 'unknown' | (string & {})
  /** a human readable status message */
  status?: string
}

export interface HandlerInput {
  encoding: 'application/json'
  body: InputSchema
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
