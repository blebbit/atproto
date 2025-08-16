// @ts-nocheck

import { AtpAgent } from '@atproto/api'
import { getRkey } from './util'

const funcs = {
  describeRepo: {
    fn: async (agent: AtpAgent, { repo }) => {
      const r = await agent.com.atproto.repo.describeRepo({
        repo,
      })
      return r.data
    },
    args: ['repo'],
    help: 'Describe an account repo.',
  },
  listRecords: {
    fn: async (agent: AtpAgent, { repo, collection, opts }) => {
      const parsedOpts = opts ? JSON.parse(opts) : undefined
      const r = await agent.com.atproto.repo.listRecords({
        repo,
        collection,
        ...parsedOpts,
      })
      return r.data
    },
    args: ['repo', 'collection', 'opts?'],
    help: 'List records in a collection. opts should be a JSON string.',
  },
  delCollection: {
    fn: async function (agent: AtpAgent, { repo, collection }) {
      const data = await funcs.listRecords.fn(agent, { repo, collection })
      for (const r of data.records) {
        const rkey = getRkey(r)
        await funcs.delRecord.fn(agent, { repo, collection, rkey })
      }
    },
    args: ['repo', 'collection'],
    help: 'Delete all records in a collection.',
  },
  createRecord: {
    fn: async (agent: AtpAgent, { repo, collection, record, opts }) => {
      const now = new Date().toISOString()
      const recordData = JSON.parse(record)
      const parsedOpts = opts ? JSON.parse(opts) : undefined
      if (!recordData.createdAt) {
        recordData.createdAt = now
      }
      recordData.updatedAt = now
      const r = await agent.com.atproto.repo.createRecord({
        repo,
        collection,
        record: recordData,
        ...parsedOpts,
      })
      return r.data
    },
    args: ['repo', 'collection', 'record', 'opts?'],
    help: 'Create a record. The record and opts should be a JSON strings.',
  },
  getRecord: {
    fn: async (agent: AtpAgent, { repo, collection, rkey, opts }) => {
      const parsedOpts = opts ? JSON.parse(opts) : undefined
      const r = await agent.com.atproto.repo.getRecord({
        repo,
        collection,
        rkey,
        ...parsedOpts,
      })
      return r.data
    },
    args: ['repo', 'collection', 'rkey', 'opts?'],
    help: 'Get a record. opts should be a JSON string.',
  },
  putRecord: {
    fn: async (agent: AtpAgent, { repo, collection, rkey, record, opts }) => {
      const recordData = JSON.parse(record)
      const parsedOpts = opts ? JSON.parse(opts) : undefined
      recordData.updatedAt = new Date().toISOString()
      const r = await agent.com.atproto.repo.putRecord({
        repo,
        collection,
        rkey,
        record: recordData,
        ...parsedOpts,
      })
      return r.data
    },
    args: ['repo', 'collection', 'rkey', 'record', 'opts?'],
    help: 'Put a record. The record and opts should be a JSON strings.',
  },
  delRecord: {
    fn: async (agent: AtpAgent, { repo, collection, rkey, opts }) => {
      const parsedOpts = opts ? JSON.parse(opts) : undefined
      const r = await agent.com.atproto.repo.deleteRecord({
        repo,
        collection,
        rkey,
        ...parsedOpts,
      })
      return r.data
    },
    args: ['repo', 'collection', 'rkey', 'opts?'],
    help: 'Delete a record. opts should be a JSON string.',
  },
}

export default funcs
