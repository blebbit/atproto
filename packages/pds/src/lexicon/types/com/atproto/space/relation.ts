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
const id = 'com.atproto.space.relation'

export interface Main {
  $type: 'com.atproto.space.relation'
  /** the subject type [user,group,etc] */
  subjectType: string
  /** the subject id to grant */
  subject: string
  /** possible values are defined in the spicedb schema and depend on context */
  permission: string
  /** The resource type [space,record,etc] */
  resourceType: string
  /** The object id to assign. */
  resource: string
  /** nsids: { allowed: map<bool>, default bool, nsid string } */
  caveats?: string
  createdAt?: string
  [k: string]: unknown
}

const hashMain = 'main'

export function isMain<V>(v: V) {
  return is$typed(v, id, hashMain)
}

export function validateMain<V>(v: V) {
  return validate<Main & V>(v, id, hashMain, true)
}

export {
  type Main as Record,
  isMain as isRecord,
  validateMain as validateRecord,
}
