import { v1 as spice } from '@authzed/authzed-node'
import { ClientSecurity } from '@authzed/authzed-node/dist/src/util'

const getClientSecurity = (): ClientSecurity => {
  const security = process.env.SPICEDB_INSECURE
  switch (security) {
    case 'true':
    case '1':
    case 'on':
      return ClientSecurity.INSECURE_LOCALHOST_ALLOWED
    default:
      return ClientSecurity.SECURE
  }
}

export function NewClient() {
  const token = process.env.SPICEDB_TOKEN
  if (!token) {
    throw new Error('SPICEDB_TOKEN is not defined')
  }
  const host = process.env.SPICEDB_HOST
  if (!host) {
    throw new Error('SPICEDB_HOST is not defined')
  }
  return spice.NewClient(token, host, getClientSecurity())
}
