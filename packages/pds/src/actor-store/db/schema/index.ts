import * as accountPref from './account-pref'
import * as backlink from './backlink'
import * as blob from './blob'
import * as record from './record'
import * as recordBlob from './record-blob'
import * as repoBlock from './repo-block'
import * as repoRoot from './repo-root'
import * as space from './space'
import * as spaceBacklink from './space-backlink'
import * as spaceBlob from './space-blob'
import * as spaceRecordBlob from './space-record-blob'

export type DatabaseSchema = accountPref.PartialDB &
  repoRoot.PartialDB &
  record.PartialDB &
  backlink.PartialDB &
  repoBlock.PartialDB &
  blob.PartialDB &
  recordBlob.PartialDB &
  space.PartialDB &
  spaceBacklink.PartialDB &
  spaceBlob.PartialDB &
  spaceRecordBlob.PartialDB

export type { AccountPref } from './account-pref'
export type { RepoRoot } from './repo-root'
export type { Record } from './record'
export type { Backlink } from './backlink'
export type { RepoBlock } from './repo-block'
export type { Blob } from './blob'
export type { RecordBlob } from './record-blob'
export type { Space } from './space'
export type { SpaceBacklink } from './space-backlink'
export type { SpaceBlob } from './space-blob'
export type { SpaceRecordBlob } from './space-record-blob'
