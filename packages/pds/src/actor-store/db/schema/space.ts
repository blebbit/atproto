// @NOTE also used by app-view (moderation)
export interface Space {
  uri: string
  cid: string
  did: string
  space: string
  collection: string
  rkey: string
  record: string
  indexedAt: string
  takedownRef: string | null
}

export const tableName = 'space'

export type PartialDB = { [tableName]: Space }
