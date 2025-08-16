import { CID } from 'multiformats/cid'
import * as crypto from '@atproto/crypto'
import { RepoRecord } from '@atproto/lexicon'
import { BackgroundQueue } from '../../background'
import { BlobStore, WriteOpAction } from '@atproto/repo'
import { AtUri } from '@atproto/syntax'
import { StatusAttr } from '../../lexicon/types/com/atproto/admin/defs'
import { dbLogger as log } from '../../logger'
import { ActorDb, Backlink } from '../db'
import { SpaceReader, getBacklinks } from './reader'
import { BlobTransactor } from '../blob/transactor'
import * as LEX from '../../lexicon/lexicons'

export class SpaceTransactor extends SpaceReader {
  blob: BlobTransactor
  // storage: SqlRepoTransactor

  constructor(
    public db: ActorDb,
    public blobstore: BlobStore,
    public did: string,
    public signingKey: crypto.Keypair,
    public backgroundQueue: BackgroundQueue,
    public now: string = new Date().toISOString(),
  ) {
    super(db)
    this.blob = new BlobTransactor(db, blobstore, backgroundQueue)
  }

  // we should simplify the confusion around parent/space
  // only spaces really use parent
  // for everything else, we can use space as the parent
  // which means we can probably have one less column in the database
  // and rely on the record.space, space, and spicedb for this relationship

  async insertRecord({
    uri,
    space,
    collection,
    rkey,
    cid,
    record,
    indexedAt = new Date().toISOString(),
    did,
  }: {
    uri: AtUri,
    space: string,
    collection: string,
    rkey: string,
    cid: CID,
    record: RepoRecord,
    indexedAt?: string,
    did: string, // actor creating the record
  }) {
    log.debug({ uri }, 'creating record')

    // create our row
    const row = {
      uri: uri.toString(),
      space,
      collection: collection,
      rkey,
      cid: cid.toString(),
      record: JSON.stringify(record),
      indexedAt,
      did,
    }

    await this.db.db
      .insertInto('space')
      .values(row)
      .onConflict((oc) =>
        oc.column('uri').doUpdateSet({
          cid: row.cid,
          record: JSON.stringify(row.record),
          indexedAt: row.indexedAt,
          // HMMM, can we just update the version if enabled?
          // or will it be in the uri already?
          // version should be monotonic and set by the PDS?
          // could also use as a swap condition
        }),
      )
      .execute()

    log.info({ uri }, 'created space')
  }

  async indexRecord(
    uri: AtUri,
    cid: CID,
    record: RepoRecord | null,
    action: WriteOpAction.Create | WriteOpAction.Update = WriteOpAction.Create,
    repoRev: string,
    timestamp?: string,
  ) {
    log.debug({ uri }, 'indexing record')
    const row = {
      uri: uri.toString(),
      cid: cid.toString(),
      collection: uri.collection,
      rkey: uri.rkey,
      repoRev: repoRev,
      indexedAt: timestamp || new Date().toISOString(),
    }
    if (!uri.hostname.startsWith('did:')) {
      throw new Error('Expected indexed URI to contain DID')
    } else if (row.collection.length < 1) {
      throw new Error('Expected indexed URI to contain a collection')
    } else if (row.rkey.length < 1) {
      throw new Error('Expected indexed URI to contain a record key')
    }

    // Track current version of record
    await this.db.db
      .insertInto('record')
      .values(row)
      .onConflict((oc) =>
        oc.column('uri').doUpdateSet({
          cid: row.cid,
          repoRev: repoRev,
          indexedAt: row.indexedAt,
        }),
      )
      .execute()

    if (record !== null) {
      // Maintain backlinks
      const backlinks = getBacklinks(uri, record)
      if (action === WriteOpAction.Update) {
        // On update just recreate backlinks from scratch for the record, so we can clear out
        // the old ones. E.g. for weird cases like updating a follow to be for a different did.
        await this.removeBacklinksByUri(uri)
      }
      await this.addBacklinks(backlinks)
    }

    log.info({ uri }, 'indexed record')
  }

  async deleteRecord(uri: AtUri) {
    log.debug({ uri }, 'deleting indexed record')
    const deleteQuery = this.db.db
      .deleteFrom('record')
      .where('uri', '=', uri.toString())
    const backlinkQuery = this.db.db
      .deleteFrom('backlink')
      .where('uri', '=', uri.toString())
    await Promise.all([deleteQuery.execute(), backlinkQuery.execute()])

    log.info({ uri }, 'deleted indexed record')
  }

  async removeBacklinksByUri(uri: AtUri) {
    await this.db.db
      .deleteFrom('backlink')
      .where('uri', '=', uri.toString())
      .execute()
  }

  async addBacklinks(backlinks: Backlink[]) {
    if (backlinks.length === 0) return
    await this.db.db
      .insertInto('backlink')
      .values(backlinks)
      .onConflict((oc) => oc.doNothing())
      .execute()
  }

  async updateRecordTakedownStatus(uri: AtUri, takedown: StatusAttr) {
    const takedownRef = takedown.applied
      ? takedown.ref ?? new Date().toISOString()
      : null
    await this.db.db
      .updateTable('record')
      .set({ takedownRef })
      .where('uri', '=', uri.toString())
      .executeTakeFirst()
  }
}
