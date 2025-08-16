// @ts-nocheck

import { AtpAgent } from '@atproto/api'
import { getRkey } from './util'

const funcs = {
  createAccount: {
    fn: async (agent: AtpAgent, { email, handle, password }) => {
      const r = await agent.com.atproto.server.createAccount({
        email,
        handle,
        password,
      })
      return r.data
    },
    args: ['email', 'handle', 'password'],
    help: 'Create a new account on the PDS.',
  },
  getRepoStatus: {
    fn: async (agent: AtpAgent, { did }) => {
      const r = await agent.com.atproto.sync.getRepoStatus({
        did
      })
      return r.data
    },
    args: ['did'],
    help: 'Get account status from the PDS.',
  },
  listAccounts: {
    fn: async (agent: AtpAgent) => {
      const r = await agent.com.atproto.sync.listRepos()
      return r.data
    },
    args: [],
    help: 'List accounts on the PDS.',
  }
}

export default funcs
