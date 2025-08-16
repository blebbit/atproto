export interface SpaceBlob {
  cid: string
  space: string
  mimeType: string
  size: number
  tempKey: string | null
  width: number | null
  height: number | null
  createdAt: string
  takedownRef: string | null
}

export const tableName = 'space_blob'

export type PartialDB = { [tableName]: SpaceBlob }
