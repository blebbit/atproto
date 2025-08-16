import { CID } from 'multiformats/cid'
import { RepoRecord } from '@atproto/lexicon'
import { CidSet, cborToLexRecord, formatDataKey } from '@atproto/repo'
import * as syntax from '@atproto/syntax'
import { AtUri, ensureValidAtUri } from '@atproto/syntax'
import { countAll, notSoftDeletedClause } from '../../db/util'
import { ids } from '../../lexicon/lexicons'
import { Record as SpaceRecord } from '../../lexicon/types/com/atproto/space/space'
import { Record as ProfileRecord } from '../../lexicon/types/app/bsky/actor/profile'
import { Record as PostRecord } from '../../lexicon/types/app/bsky/feed/post'
import { StatusAttr } from '../../lexicon/types/com/atproto/admin/defs'
import { LocalRecords } from '../../read-after-write/types'
import { ActorDb, Backlink } from '../db'

export type RecordDescript = {
  uri: string
  path: string
  cid: CID
}

export class SpaceReader {
  constructor(public db: ActorDb) {}

  async recordCount(): Promise<number> {
    const res = await this.db.db
      .selectFrom('space')
      .select(countAll.as('count'))
      .executeTakeFirst()
    return res?.count ?? 0
  }

  async listAll(): Promise<RecordDescript[]> {
    const records: RecordDescript[] = []
    let cursor: string | undefined = ''
    while (cursor !== undefined) {
      const res = await this.db.db
        .selectFrom('space')
        .select(['uri', 'cid'])
        .where('uri', '>', cursor)
        .orderBy('uri', 'asc')
        .limit(1000)
        .execute()
      for (const row of res) {
        const parsed = new AtUri(row.uri)
        records.push({
          uri: row.uri,
          path: formatDataKey(parsed.collection, parsed.rkey),
          cid: CID.parse(row.cid),
        })
      }
      cursor = res.at(-1)?.uri
    }
    return records
  }

  async listSpaces(parent: string): Promise<string[]> {
    const spaces = await this.db.db
      .selectFrom('space')
      .select('uri')
      .where('parent', '=', parent)
      .where('collection', '=', ids.ComAtprotoSpaceSpace)
      .execute()
    return spaces.map((row) => row.uri)
  }

  async listRoles(parent: string): Promise<string[]> {
    const spaces = await this.db.db
      .selectFrom('space')
      .select('uri')
      .where('parent', '=', parent)
      .where('collection', '=', ids.ComAtprotoSpaceRole)
      .execute()
    return spaces.map((row) => row.uri)
  }

  async listGroups(space: string): Promise<string[]> {
    const collections = await this.db.db
      .selectFrom('space')
      .select('uri')
      .where('space', '=', space)
      .where('collection', '=', ids.ComAtprotoSpaceGroup)
      .execute()

    return collections.map((row) => row.uri)
  }

  async listCollections(space: string): Promise<string[]> {
    const collections = await this.db.db
      .selectFrom('space')
      .select('collection')
      .where('space', '=', space)
      .groupBy('collection')
      .execute()

    return collections.map((row) => row.collection)
  }

  async listRecordsForCollection(opts: {
    space: string
    collection: string
    limit: number
    reverse: boolean
    cursor?: string
    includeSoftDeleted?: boolean
  }): Promise<{ uri: string; cid: string; value: Record<string, unknown> }[]> {
    const {
      space,
      collection,
      limit,
      reverse,
      cursor,
      includeSoftDeleted = false,
    } = opts

    const { ref } = this.db.db.dynamic
    let builder = this.db.db
      .selectFrom('space')
      .where('space.space', '=', space)
      .where('space.collection', '=', collection)
      .if(!includeSoftDeleted, (qb) =>
        qb.where(notSoftDeletedClause(ref('space'))),
      )
      .orderBy('space.indexedAt', reverse ? 'asc' : 'desc')
      .limit(limit)
      .selectAll()

    if (cursor !== undefined) {
      if (reverse) {
        builder = builder.where('space.indexedAt', '>', cursor)
      } else {
        builder = builder.where('space.indexedAt', '<', cursor)
      }
    }
    const res = await builder.execute()
    return res.map((row) => {
      return {
        uri: row.uri,
        cid: row.cid,
        value: JSON.parse(row.record),
      }
    })
  }

  async getRecord(
    uri: AtUri,
    cid: string | null,
    includeSoftDeleted = false,
  ): Promise<{
    uri: string
    cid: string
    value: Record<string, unknown>
    indexedAt: string
    takedownRef: string | null
  } | null> {
    const { ref } = this.db.db.dynamic
    let builder = this.db.db
      .selectFrom('space')
      .where('space.uri', '=', uri.toString())
      .selectAll()
      .if(!includeSoftDeleted, (qb) =>
        qb.where(notSoftDeletedClause(ref('space'))),
      )
    if (cid) {
      builder = builder.where('space.cid', '=', cid)
    }
    const record = await builder.executeTakeFirst()
    if (!record) return null
    return {
      uri: record.uri,
      cid: record.cid,
      value: JSON.parse(record.record),
      indexedAt: record.indexedAt,
      takedownRef: record.takedownRef ? record.takedownRef.toString() : null,
    }
  }

  async hasRecord(
    uri: AtUri,
    cid: string | null,
    includeSoftDeleted = false,
  ): Promise<boolean> {
    const { ref } = this.db.db.dynamic
    let builder = this.db.db
      .selectFrom('space')
      .select('uri')
      .where('space.uri', '=', uri.toString())
      .if(!includeSoftDeleted, (qb) =>
        qb.where(notSoftDeletedClause(ref('space'))),
      )
    if (cid) {
      builder = builder.where('space.cid', '=', cid)
    }
    const record = await builder.executeTakeFirst()
    return !!record
  }

  async getRecordTakedownStatus(uri: AtUri): Promise<StatusAttr | null> {
    const res = await this.db.db
      .selectFrom('space')
      .select('takedownRef')
      .where('uri', '=', uri.toString())
      .executeTakeFirst()
    if (!res) return null
    return res.takedownRef
      ? { applied: true, ref: res.takedownRef }
      : { applied: false }
  }

  async getCurrentRecordCid(uri: AtUri): Promise<CID | null> {
    const res = await this.db.db
      .selectFrom('space')
      .select('cid')
      .where('uri', '=', uri.toString())
      .executeTakeFirst()
    return res ? CID.parse(res.cid) : null
  }

  async getRecordBacklinks(opts: {
    collection: string
    path: string
    linkTo: string
  }) {
    const { collection, path, linkTo } = opts
    return await this.db.db
      .selectFrom('space')
      .innerJoin('backlink', 'backlink.uri', 'space.uri')
      .where('backlink.path', '=', path)
      .where('backlink.linkTo', '=', linkTo)
      .where('space.collection', '=', collection)
      .selectAll('space')
      .execute()
  }

  // @NOTE this logic is a placeholder until we allow users to specify these constraints themselves.
  // Ensures that we don't end-up with duplicate likes, reposts, and follows from race conditions.

  async getBacklinkConflicts(uri: AtUri, record: RepoRecord): Promise<AtUri[]> {
    const recordBacklinks = getBacklinks(uri, record)
    const conflicts = await Promise.all(
      recordBacklinks.map((backlink) =>
        this.getRecordBacklinks({
          collection: uri.collection,
          path: backlink.path,
          linkTo: backlink.linkTo,
        }),
      ),
    )
    return conflicts
      .flat()
      .map(({ rkey }) => AtUri.make(uri.hostname, uri.collection, rkey))
  }

  async getProfileRecord(space: string) {
    const row = await this.db.db
      .selectFrom('space')
      .where('space.collection', '=', ids.ComAtprotoSpaceSpace)
      .where('space.rkey', '=', 'self')
      .where('space.space', '=', space)
      .selectAll()
      .executeTakeFirst()

    if (!row?.record) return null

    return JSON.parse(row.record) as SpaceRecord
  }
}

// @NOTE in the future this can be replaced with a more generic routine that pulls backlinks based on lex docs.
// For now we just want to ensure we're tracking links from follows, blocks, likes, and reposts.

export const getBacklinks = (uri: AtUri, record: RepoRecord): Backlink[] => {
  if (
    record?.['$type'] === ids.AppBskyGraphFollow ||
    record?.['$type'] === ids.AppBskyGraphBlock
  ) {
    const subject = record['subject']
    if (typeof subject !== 'string') {
      return []
    }
    try {
      syntax.ensureValidDid(subject)
    } catch {
      return []
    }
    return [
      {
        uri: uri.toString(),
        path: 'subject',
        linkTo: subject,
      },
    ]
  }
  if (
    record?.['$type'] === ids.AppBskyFeedLike ||
    record?.['$type'] === ids.AppBskyFeedRepost
  ) {
    const subject = record['subject']
    if (typeof subject?.['uri'] !== 'string') {
      return []
    }
    try {
      ensureValidAtUri(subject['uri'])
    } catch {
      return []
    }
    return [
      {
        uri: uri.toString(),
        path: 'subject.uri',
        linkTo: subject['uri'],
      },
    ]
  }
  return []
}
