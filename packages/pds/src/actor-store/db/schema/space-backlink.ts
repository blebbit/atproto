export interface SpaceBacklink {
  uri: string
  path: string
  linkTo: string
}

export const tableName = 'space_backlink'

export type PartialDB = { [tableName]: SpaceBacklink }
