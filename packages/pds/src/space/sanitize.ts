import {
  RepoRecord,
  ValidationError,
} from '@atproto/lexicon'
import {
  ensureValidDatetime,
  ensureValidRecordKey,
} from '@atproto/syntax'

import { hasExplicitSlur } from '../handle/explicit-slurs'

import {
  assertNoExplicitSlurs,
  assertValidRecordWithStatus,
} from '../repo'

import { InvalidRecordError } from './types'

export async function sanitize({
  repo,
  space,
  collection,
  rkey,
  record,
}: {
  repo: string
  space: string
  collection: string
  rkey: string
  record: RepoRecord
}): Promise<void>{
  // valid key formats
  ensureValidRecordKey(space)
  ensureValidRecordKey(rkey)

  // no slurs
  if (hasExplicitSlur([space, collection, rkey].join(' '))) {
    throw new InvalidRecordError('Unacceptable slur in record')
  }
  assertNoExplicitSlurs('', record)

  // probably redundant validation, doesn't belong in the transactor
  if (!repo.startsWith('did:')) {
    throw new InvalidRecordError('Expected AtURI to contain DID')
  } else if (space.length < 1) {
    throw new InvalidRecordError('Expected AtURI to contain a space')
  } else if (collection.length < 1) {
    throw new InvalidRecordError('Expected AtURI to contain a collection')
  } else if (rkey.length < 1) {
    throw new InvalidRecordError('Expected AtURI to contain a record key')
  }

  // valid time values if present
  assertValidDatetime('createdAt', record)
  assertValidDatetime('updatedAt', record)
}

// additional more rigorous check on datetimes
// this check will eventually be in the lex sdk, but this will stop the bleed until then
export const assertValidDatetime = (key: string, record: Record<string, unknown>) => {
  const dt = record[key]
  if (typeof dt !== 'string') {
    return
  }
  try {
    ensureValidDatetime(dt)
  } catch {
    throw new ValidationError(
      'updatedAt must be an valid atproto datetime (both RFC-3339 and ISO-8601)',
    )
  }
}
