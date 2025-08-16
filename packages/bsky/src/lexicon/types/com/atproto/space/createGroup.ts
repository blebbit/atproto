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
import type * as ComAtprotoSpaceDefs from './defs.js'

const is$typed = _is$typed,
  validate = _validate
const id = 'com.atproto.space.createGroup'

export type QueryParams = {}

export interface InputSchema {
  /** The handle or DID of the repo to create the group in. */
  repo: string
  /** The id of the parent space which will contain this group. Defaults to the repo root space. */
  space?: string
  /** The Record Key. */
  rkey?: string
  /** The record itself. Must contain a $type field. */
  record: { [_ in string]: unknown }
  /** Can be set to 'false' to skip Lexicon schema validation of record data, 'true' to require it, or leave unset to validate only for known Lexicons. */
  validate?: boolean
  /** Compare and swap with the previous commit by CID. */
  swapCommit?: string
}

export interface OutputSchema {
  uri: string
  cid: string
  commit?: ComAtprotoSpaceDefs.CommitMeta
  validationStatus?: 'valid' | 'unknown' | (string & {})
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
  error?: 'InvalidSwap'
}

export type HandlerOutput = HandlerError | HandlerSuccess
