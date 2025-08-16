// @ts-nocheck

import { AtpAgent } from '@atproto/api'

const funcs = {
  describeSpace: {
    fn: async (agent: AtpAgent, { repo, space }) => {
      console.log("args:", repo, space)
      const r = await agent.com.atproto.space.describeSpace({
        repo,
        rkey: space,
      })
      return r.data
    },
    args: ['repo', 'space?'],
    help: 'Describe a space.',
  },
  describeGroup: {
    fn: async (agent: AtpAgent, { repo, space, rkey }) => {
      console.log("hack:", { repo, space, rkey })
      const r = await agent.com.atproto.space.describeGroup({
        repo,
        space,
        rkey,
      })
      return r.data
    },
    args: ['repo', 'space', 'rkey'],
    help: 'Describe a group.',
  },
  createSpace: {
    fn: async (agent: AtpAgent, { repo, record, opts }) => {
      const now = new Date().toISOString()
      const parsedRecord = JSON.parse(record)
      const parsedOpts = opts ? JSON.parse(opts) : undefined
      const newRecord = {
        ...parsedRecord,
        createdAt: now,
        updatedAt: now,
      }
      const payload: any = {
        repo,
        record: newRecord,
      }
      if (parsedOpts?.rkey) {
        payload['rkey'] = parsedOpts.rkey
      }
      if (parsedOpts?.space) {
        payload['space'] = parsedOpts.space
      }
      const r = await agent.com.atproto.space.createSpace(payload)
      return r.data
    },
    args: ['repo', 'record', 'opts?'],
    help: 'Create a space. record and opts should be JSON strings.',
  },
  createGroup: {
    fn: async (agent: AtpAgent, { repo, record, opts }) => {
      const now = new Date().toISOString()
      const parsedRecord = JSON.parse(record)
      const parsedOpts = opts ? JSON.parse(opts) : undefined
      const newRecord = {
        ...parsedRecord,
        createdAt: now,
        updatedAt: now,
      }
      const payload: any = {
        repo,
        record: newRecord,
      }
      if (parsedOpts?.rkey) {
        payload['rkey'] = parsedOpts.rkey
      }
      if (parsedOpts?.space) {
        payload['space'] = parsedOpts.space
      }
      const r = await agent.com.atproto.space.createGroup(payload)
      return r.data
    },
    args: ['repo', 'record', 'opts?'],
    help: 'Create a group. record should be a JSON string.',
  },
  createRecord: {
    fn: async (agent: AtpAgent, { repo, collection, record, opts }) => {
      const now = new Date().toISOString()
      const parsedRecord = JSON.parse(record)
      const parsedOpts = opts ? JSON.parse(opts) : undefined
      const newRecord = {
        ...parsedRecord,
        createdAt: now,
        updatedAt: now,
      }
      const payload: any = {
        repo,
        collection,
        record: newRecord,
      }
      if (parsedOpts?.rkey) {
        payload['rkey'] = parsedOpts.rkey
      }
      if (parsedOpts?.space) {
        payload['space'] = parsedOpts.space
      }
      if (parsedOpts?.parent) {
        payload['parent'] = parsedOpts.parent
      }
      const r = await agent.com.atproto.space.createRecord(payload)
      return r.data
    },
    args: ['repo', 'space', 'collection', 'record', 'opts?'],
    help: 'Create a record. record should be a JSON string.',
  },
  createRelationship: {
    fn: async (agent: AtpAgent, { repo, space, subject, relation, object }) => {
      const r = await agent.com.atproto.space.createRelationship({
        repo,
        space,
        subject,
        relation,
        object,
      })
      return r.data
    },
    args: ['repo', 'space', 'subject', 'relation', 'object'],
    help: 'Create a relationship.',
  },
  // applyWrites: {
  //   fn: async (agent: AtpAgent, { repo, space, writes }) => {
  //     const r = await agent.com.atproto.space.applyWrites({
  //       repo,
  //       space,
  //       writes: JSON.parse(writes),
  //     })
  //     return r.data
  //   },
  //   args: ['repo', 'space', 'writes'],
  //   help: 'Apply a batch of writes to a space. writes should be a JSON string.',
  // },
  deleteSpace: {
    fn: async (agent: AtpAgent, { repo, space }) => {
      const r = await agent.com.atproto.space.deleteSpace({
        repo,
        space,
      })
      return r.data
    },
    args: ['repo', 'space'],
    help: 'Delete a space.',
  },
  putSpace: {
    fn: async (agent: AtpAgent, { repo, space, record, opts }) => {
      const parsedOpts = opts ? JSON.parse(opts) : undefined
      const r = await agent.com.atproto.space.putSpace({
        repo,
        space,
        record: JSON.parse(record),
      })
      return r.data
    },
    args: ['repo', 'space', 'record'],
    help: 'Put a space. record should be a JSON string.',
  },
  checkPermission: {
    fn: async (agent: AtpAgent, { repo, space, subject, permission, object }) => {
      const r = await agent.com.atproto.space.checkPermission({
        repo,
        space,
        subject,
        permission,
        object,
      })
      return r.data
    },
    args: ['repo', 'space', 'subject', 'permission', 'object'],
    help: 'Check a permission.',
  },
  checkPermissions: {
    fn: async (agent: AtpAgent, { repo, space, subject, permission, objects }) => {
      const r = await agent.com.atproto.space.checkPermissions({
        repo,
        space,
        subject,
        permission,
        objects: JSON.parse(objects),
      })
      return r.data
    },
    args: ['repo', 'space', 'subject', 'permission', 'objects'],
    help: 'Check permissions in bulk. objects should be a JSON string.',
  },
  deleteGroup: {
    fn: async (agent: AtpAgent, { repo, space }) => {
      const r = await agent.com.atproto.space.deleteGroup({
        repo,
        space,
      })
      return r.data
    },
    args: ['repo', 'space'],
    help: 'Delete a group.',
  },
  deleteRecord: {
    fn: async (agent: AtpAgent, { repo, space, collection, rkey }) => {
      const r = await agent.com.atproto.space.deleteRecord({
        repo,
        space,
        collection,
        rkey,
      })
      return r.data
    },
    args: ['repo', 'space', 'collection', 'rkey'],
    help: 'Delete a record.',
  },
  deleteRelationship: {
    fn: async (agent: AtpAgent, { repo, space, subject, relation, object }) => {
      const r = await agent.com.atproto.space.deleteRelationship({
        repo,
        space,
        subject,
        relation,
        object,
      })
      return r.data
    },
    args: ['repo', 'space', 'subject?', 'relation?', 'object?'],
    help: 'Delete a relationship.',
  },
  getBlob: {
    fn: async (agent: AtpAgent, { repo, space, cid }) => {
      const r = await agent.com.atproto.space.getBlob({
        repo,
        space,
        cid,
      })
      return r.data
    },
    args: ['repo', 'space', 'cid'],
    help: 'Get a blob.',
  },
  getGroup: {
    fn: async (agent: AtpAgent, { repo, space, group, cid }) => {
      const r = await agent.com.atproto.space.getGroup({
        repo,
        space,
        group,
        cid,
      })
      return r.data
    },
    args: ['repo', 'space', 'group', 'cid?'],
    help: 'Get a group.',
  },
  getRecord: {
    fn: async (agent: AtpAgent, { repo, space, collection, rkey, cid }) => {
      const r = await agent.com.atproto.space.getRecord({
        repo,
        space,
        collection,
        rkey,
        cid,
      })
      return r.data
    },
    args: ['repo', 'space', 'collection', 'rkey', 'cid?'],
    help: 'Get a record.',
  },
  getRelationship: {
    fn: async (agent: AtpAgent, { repo, space, subject, relation, object, cid }) => {
      const r = await agent.com.atproto.space.getRelationship({
        repo,
        space,
        subject,
        relation,
        object,
        cid,
      })
      return r.data
    },
    args: ['repo', 'space', 'subject?', 'relation?', 'object?', 'cid?'],
    help: 'Get a relationship.',
  },
  getSpace: {
    fn: async (agent: AtpAgent, { repo, space, cid }) => {
      const r = await agent.com.atproto.space.getSpace({
        repo,
        space,
        cid,
      })
      return r.data
    },
    args: ['repo', 'space', 'cid?'],
    help: 'Get a space.',
  },
  listBlobs: {
    fn: async (agent: AtpAgent, { repo, space, since, limit, cursor }) => {
      const r = await agent.com.atproto.space.listBlobs({
        repo,
        space,
        since,
        limit: limit ? parseInt(limit) : undefined,
        cursor,
      })
      return r.data
    },
    args: ['repo', 'space', 'since?', 'limit?', 'cursor?'],
    help: 'List blobs.',
  },
  listGroups: {
    fn: async (agent: AtpAgent, { repo, space, limit, cursor, reverse }) => {
      const r = await agent.com.atproto.space.listGroups({
        repo,
        space,
        limit: limit ? parseInt(limit) : undefined,
        cursor,
        reverse: reverse === 'true',
      })
      return r.data
    },
    args: ['repo', 'space', 'limit?', 'cursor?', 'reverse?'],
    help: 'List groups.',
  },
  listMissingBlobs: {
    fn: async (agent: AtpAgent, { repo, space, limit, cursor }) => {
      const r = await agent.com.atproto.space.listMissingBlobs({
        repo,
        space,
        limit: limit ? parseInt(limit) : undefined,
        cursor,
      })
      return r.data
    },
    args: ['repo', 'space', 'limit?', 'cursor?'],
    help: 'List missing blobs.',
  },
  listRecords: {
    fn: async (agent: AtpAgent, { repo, space, collection, limit, cursor, reverse }) => {
      const r = await agent.com.atproto.space.listRecords({
        repo,
        space,
        collection,
        limit: limit ? parseInt(limit) : undefined,
        cursor,
        reverse: reverse === 'true',
      })
      return r.data
    },
    args: ['repo', 'space', 'collection', 'limit?', 'cursor?', 'reverse?'],
    help: 'List records.',
  },
  listSpaces: {
    fn: async (agent: AtpAgent, { repo, limit, cursor, reverse }) => {
      const r = await agent.com.atproto.space.listSpaces({
        repo,
        limit: limit ? parseInt(limit) : undefined,
        cursor,
        reverse: reverse === 'true',
      })
      return r.data
    },
    args: ['repo', 'limit?', 'cursor?', 'reverse?'],
    help: 'List spaces.',
  },
  lookupResources: {
    fn: async (agent: AtpAgent, { repo, space, subject, permission }) => {
      const r = await agent.com.atproto.space.lookupResources({
        repo,
        space,
        subject,
        permission,
      })
      return r.data
    },
    args: ['repo', 'space', 'subject', 'permission'],
    help: 'Lookup resources.',
  },
  lookupSubjects: {
    fn: async (agent: AtpAgent, { repo, space, object, permission }) => {
      const r = await agent.com.atproto.space.lookupSubjects({
        repo,
        space,
        object,
        permission,
      })
      return r.data
    },
    args: ['repo', 'space', 'object', 'permission'],
    help: 'Lookup subjects.',
  },
  putGroup: {
    fn: async (agent: AtpAgent, { repo, space, group, record }) => {
      const r = await agent.com.atproto.space.putGroup({
        repo,
        space,
        group,
        record: JSON.parse(record),
      })
      return r.data
    },
    args: ['repo', 'space', 'group', 'record'],
    help: 'Put a group. record should be a JSON string.',
  },
  putRecord: {
    fn: async (agent: AtpAgent, { repo, space, collection, rkey, record }) => {
      const r = await agent.com.atproto.space.putRecord({
        repo,
        space,
        collection,
        rkey,
        record: JSON.parse(record),
      })
      return r.data
    },
    args: ['repo', 'space', 'collection', 'rkey', 'record'],
    help: 'Put a record. record should be a JSON string.',
  },
  putRelationship: {
    fn: async (agent: AtpAgent, { repo, space, subject, relation, object }) => {
      const r = await agent.com.atproto.space.putRelationship({
        repo,
        space,
        subject,
        relation,
        object,
      })
      return r.data
    },
    args: ['repo', 'space', 'subject', 'relation', 'object'],
    help: 'Put a relationship.',
  },
  uploadBlob: {
    fn: async (agent: AtpAgent, { repo, space, blob }) => {
      const r = await agent.com.atproto.space.uploadBlob(blob, {
        repo,
        space,
      })
      return r.data
    },
    args: ['repo', 'space', 'blob'],
    help: 'Upload a blob. blob should be a path to a file.',
  },
}
export default funcs
