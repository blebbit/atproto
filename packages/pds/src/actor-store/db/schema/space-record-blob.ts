export interface SpaceRecordBlob {
  blobCid: string
  recordUri: string
}

export const tableName = 'space_record_blob'

export type PartialDB = { [tableName]: SpaceRecordBlob }
