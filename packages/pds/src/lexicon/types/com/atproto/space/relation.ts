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

export interface Record {
  $type: 'com.atproto.space.relation'
  /** the subject type [user,group,etc] */
  subjectType?: string
  /** the subject id to grant */
  subject?: string
  /** possible values are defined in the spicedb schema and depend on context */
  permission?: string
  /** The resource type [space,record,etc] */
  resourceType?: string
  /** The object id to assign. */
  resource?: string
  /** nsids: { allowed: map<bool>, default bool, nsid string } */
  caveats?: { [_ in string]: unknown }
  createdAt?: string
  [k: string]: unknown
}

const hashRecord = 'main'

export function isRecord<V>(v: V) {
  return is$typed(v, id, hashRecord)
}

export function validateRecord<V>(v: V) {
  return validate<Record & V>(v, id, hashRecord, true)
}
