import { Kysely } from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {

  await db.schema
    .createTable('space')
    .addColumn('uri', 'varchar', (col) => col.primaryKey())
    .addColumn('cid', 'varchar', (col) => col.notNull())
    // the account that created or updated the record
    .addColumn('did', 'varchar', (col) => col.notNull())
    .addColumn('parent', 'varchar', (col) => col.notNull())
    .addColumn('space', 'varchar', (col) => col.notNull())
    .addColumn('collection', 'varchar', (col) => col.notNull())
    .addColumn('rkey', 'varchar', (col) => col.notNull())
    .addColumn('record', 'varchar', (col) => col.notNull())
    .addColumn('indexedAt', 'varchar', (col) => col.notNull())
    .addColumn('takedownRef', 'varchar')
    // #futurology for edits w/ history
    .addColumn('version', 'varchar')
    .execute()

  await db.schema
    .createIndex('space_space_idx')
    .on('space')
    .column('space')
    .execute()
  await db.schema
    .createIndex('space_parent_idx')
    .on('space')
    .column('parent')
    .execute()
  await db.schema
    .createIndex('space_collection_idx')
    .on('space')
    .column('collection')
    .execute()
  await db.schema
    .createIndex('space_rkey_idx')
    .on('space')
    .column('rkey')
    .execute()
  await db.schema
    .createIndex('space_cid_idx')
    .on('space')
    .column('cid')
    .execute()
  await db.schema
    .createIndex('space_did_idx')
    .on('space')
    .column('did')
    .execute()

  await db.schema
    .createTable('space_blob')
    .addColumn('cid', 'varchar', (col) => col.primaryKey())
    .addColumn('space', 'varchar', (col) => col.notNull())
    .addColumn('mimeType', 'varchar', (col) => col.notNull())
    .addColumn('size', 'integer', (col) => col.notNull())
    .addColumn('tempKey', 'varchar')
    .addColumn('metadata', 'varchar') // JSON object with details like dimensions, playrate, ... mimeType dependent
    .addColumn('createdAt', 'varchar', (col) => col.notNull())
    .addColumn('takedownRef', 'varchar')
    .execute()
  await db.schema
    .createIndex('space_blob_space_idx')
    .on('space_blob')
    .column('space')
    .execute()
  await db.schema
    .createIndex('space_blob_tempkey_idx')
    .on('space_blob')
    .column('tempKey')
    .execute()

  await db.schema
    .createTable('space_record_blob')
    .addColumn('blobCid', 'varchar', (col) => col.notNull())
    .addColumn('recordUri', 'varchar', (col) => col.notNull())
    .addPrimaryKeyConstraint(`space_record_blob_pkey`, ['blobCid', 'recordUri'])
    .execute()

}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('space_record_blob').execute()
  await db.schema.dropTable('space_blob').execute()
  await db.schema.dropTable('space').execute()
}
