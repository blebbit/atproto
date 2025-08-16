import { CID } from 'multiformats/cid'
import {
  BlobRef,
  LexValue,
  LexiconDefNotFoundError,
  RepoRecord,
  ValidationError,
  lexToIpld,
  untypedJsonBlobRef,
} from '@atproto/lexicon'
import {
  RecordCreateOp,
  RecordDeleteOp,
  RecordUpdateOp,
  RecordWriteOp,
  WriteOpAction,
  cborToLex,
} from '@atproto/repo'
import {
  AtUri,
  ensureValidDatetime,
  ensureValidRecordKey,
} from '@atproto/syntax'
import * as lex from '../lexicon/lexicons'
import {
  assertNoExplicitSlurs,
  assertValidCreatedAt,
  assertValidRecordWithStatus,
  blobsForWrite,
  cidForSafeRecord,
  setCollectionName,
} from '../repo'

import {
  PreparedCreate,
  PreparedDelete,
  PreparedUpdate,
  PreparedWrite,
  ValidationStatus,
} from './types'

export const prepareCreate = async ({
  reqDid,
  repoDid,
  space,
  collection,
  rkey,
  record,
  swapCid,
  version,
  validate = false,
}: {
  reqDid: string
  repoDid: string
  space: string
  collection: string
  rkey: string
  record: RepoRecord
  swapCid?: CID | null
  version?: number
  validate?: boolean
}): Promise<PreparedCreate> => {

  // ensure the record $type
  record.$type = collection

  // maybe validate record
  let validationStatus: ValidationStatus
  if (validate) {
    validationStatus = assertValidRecordWithStatus(record, {
      requireLexicon: validate === true,
    })
  }

  return {
    action: WriteOpAction.Create,
    uri: AtUri.make(repoDid, collection, rkey, space),
    parentUri: AtUri.make(repoDid, collection, space),
    cid: await cidForSafeRecord(record),
    swapCid,
    record,
    blobs: blobsForWrite(record, validate),
    validationStatus,
  }
}

export const prepareUpdate = async (opts: {
  reqDid: string
  repoDid: string
  space: string
  collection: string
  rkey: string
  swapCid?: CID | null
  record: RepoRecord
  validate?: boolean
}): Promise<PreparedUpdate> => {
  const { space, repoDid, collection, rkey, swapCid, validate } = opts
  const maybeValidate = validate !== false
  const record = setCollectionName(collection, opts.record, maybeValidate)
  let validationStatus: ValidationStatus
  if (maybeValidate) {
    validationStatus = assertValidRecordWithStatus(record, {
      requireLexicon: validate === true,
    })
  }
  assertNoExplicitSlurs(rkey, record)
  return {
    action: WriteOpAction.Update,
    uri: AtUri.make(repoDid, collection, rkey, space),
    parentUri: AtUri.make(repoDid, collection, space),
    cid: await cidForSafeRecord(record),
    swapCid,
    record,
    blobs: blobsForWrite(record, maybeValidate),
    validationStatus,
  }
}

export const prepareDelete = (opts: {
  did: string
  space: string
  collection: string
  rkey: string
  swapCid?: CID | null
}): PreparedDelete => {
  const { space, did, collection, rkey, swapCid } = opts
  return {
    action: WriteOpAction.Delete,
    uri: AtUri.make(did, collection, rkey, space),
    parentUri: AtUri.make(did, collection, space),
    swapCid,
  }
}

export const createWriteToOp = (write: PreparedCreate): RecordCreateOp => ({
  action: WriteOpAction.Create,
  collection: write.uri.collection,
  rkey: write.uri.rkey,
  record: write.record,
})

export const updateWriteToOp = (write: PreparedUpdate): RecordUpdateOp => ({
  action: WriteOpAction.Update,
  collection: write.uri.collection,
  rkey: write.uri.rkey,
  record: write.record,
})

export const deleteWriteToOp = (write: PreparedDelete): RecordDeleteOp => ({
  action: WriteOpAction.Delete,
  collection: write.uri.collection,
  rkey: write.uri.rkey,
})

export const writeToOp = (write: PreparedWrite): RecordWriteOp => {
  switch (write.action) {
    case WriteOpAction.Create:
      return createWriteToOp(write)
    case WriteOpAction.Update:
      return updateWriteToOp(write)
    case WriteOpAction.Delete:
      return deleteWriteToOp(write)
    default:
      throw new Error(`Unrecognized action: ${write}`)
  }
}
