import { v1 as spice } from '@authzed/authzed-node'

const getClientSecurity = (security: string): spice.ClientSecurity => {
  switch (security.toLowerCase()) {
    case 'true':
    case '1':
    case 'on':
    case 'yes':
      return spice.ClientSecurity.INSECURE_LOCALHOST_ALLOWED
    default:
      return spice.ClientSecurity.SECURE
  }
}

export function getSpicedbClient({
  host,
  token,
  insecure,
}: {
  host?: string
  token?: string
  insecure?: string
}) {
  if (!token) {
    throw new Error('SPICEDB_TOKEN is not defined')
  }
  if (!host) {
    throw new Error('SPICEDB_HOST is not defined')
  }
  const { promises } = spice.NewClient(token, host, getClientSecurity(insecure || "no"))
  return promises
}
