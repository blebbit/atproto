import { AppContext } from '../../../../context'
import { Server } from '../../../../lexicon'

import applyWrites from './applyWrites'
import checkPermission from './checkPermission'
import checkPermissions from './checkPermissions'
import createGroup from './createGroup'
import createRecord from './createRecord'
import createRelationship from './createRelationship'
import createSpace from './createSpace'
import deleteGroup from './deleteGroup'
import deleteRecord from './deleteRecord'
import deleteRelationship from './deleteRelationship'
import deleteSpace from './deleteSpace'
import describeGroup from './describeGroup'
import describeSpace from './describeSpace'
import getBlob from './getBlob'
import getGroup from './getGroup'
import getRecord from './getRecord'
import getRelationship from './getRelationship'
import getSpace from './getSpace'
import importRepo from './importRepo'
import listBlobs from './listBlobs'
import listGroups from './listGroups'
import listMissingBlobs from './listMissingBlobs'
import listRecords from './listRecords'
import listSpaces from './listSpaces'
import lookupResources from './lookupResources'
import lookupSubjects from './lookupSubjects'
import putGroup from './putGroup'
import putRecord from './putRecord'
import putRelationship from './putRelationship'
import putSpace from './putSpace'
import uploadBlob from './uploadBlob'

export default function (server: Server, ctx: AppContext) {
  applyWrites(server, ctx)
  checkPermission(server, ctx)
  checkPermissions(server, ctx)
  createGroup(server, ctx)
  createRecord(server, ctx)
  createRelationship(server, ctx)
  createSpace(server, ctx)
  deleteGroup(server, ctx)
  deleteRecord(server, ctx)
  deleteRelationship(server, ctx)
  deleteSpace(server, ctx)
  describeGroup(server, ctx)
  describeSpace(server, ctx)
  getBlob(server, ctx)
  getGroup(server, ctx)
  getRecord(server, ctx)
  getRelationship(server, ctx)
  getSpace(server, ctx)
  importRepo(server, ctx)
  listBlobs(server, ctx)
  listGroups(server, ctx)
  listMissingBlobs(server, ctx)
  listRecords(server, ctx)
  listSpaces(server, ctx)
  lookupResources(server, ctx)
  lookupSubjects(server, ctx)
  putGroup(server, ctx)
  putRecord(server, ctx)
  putRelationship(server, ctx)
  putSpace(server, ctx)
  uploadBlob(server, ctx)
}
