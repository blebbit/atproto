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
const id = 'com.atproto.space.defs'

export interface CommitMeta {
  $type?: 'com.atproto.space.defs#commitMeta'
  cid: string
  rev: string
}

const hashCommitMeta = 'commitMeta'

export function isCommitMeta<V>(v: V) {
  return is$typed(v, id, hashCommitMeta)
}

export function validateCommitMeta<V>(v: V) {
  return validate<CommitMeta & V>(v, id, hashCommitMeta)
}

export interface PermissionTriplet {
  $type?: 'com.atproto.space.defs#permissionTriplet'
  subject?: string
  permission?: string
  resource?: string
}

const hashPermissionTriplet = 'permissionTriplet'

export function isPermissionTriplet<V>(v: V) {
  return is$typed(v, id, hashPermissionTriplet)
}

export function validatePermissionTriplet<V>(v: V) {
  return validate<PermissionTriplet & V>(v, id, hashPermissionTriplet)
}
