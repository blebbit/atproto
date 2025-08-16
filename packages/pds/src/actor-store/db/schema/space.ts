// @NOTE also used by app-view (moderation)
export interface Space {
  uri: string
  parent: string
  space: string
  collection: string
  rkey: string
  cid: string
  record: string
  indexedAt: string
  takedownRef: string | null
  did: string
  version: string | null
}

export const tableName = 'space'

export type PartialDB = { [tableName]: Space }
