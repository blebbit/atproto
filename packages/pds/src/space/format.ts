import { AtUri } from "@atproto/syntax"

// spicedb id has layout
// <repo>/<space>/<collection>/<rkey>
// 1. same layout order as hierarchy
// 2. globally unique, PDS is multi-tenant fyi
// 3. key id formatting limitations / transformations

export function aturi2spicedb(uri: AtUri | string): string {
  // ensure uri is an AtUri instance
  if (typeof uri === 'string') {
    uri = new AtUri(uri)
  }

  // do char conversion
  const repo = atproto2spicedb(uri.hostname)
  var sid = repo

  if (uri.space && uri.space.length > 0) {
    sid += `/${atproto2spicedb(uri.space)}`
  }

  const path = atproto2spicedb(uri.pathname) // nsid/rkey (if present)
  if (path !== "/") {
    sid += path
  }

  // make sid (spicedb "id")
  // console.log('aturi2spicedb', uri, '=>', sid)
  return sid
}

export function spicedb2aturi(sid: string): AtUri {
  const parts = sid.split('/')
  const repo = spicedb2atproto(parts[0])
  const space = spicedb2atproto(parts[1])
  const collection = parts[2] ? spicedb2atproto(parts[2]) : undefined
  const rkey = parts[3] ? spicedb2atproto(parts[3]) : undefined

  return AtUri.make(repo, collection, rkey, space)
}

export function atproto2spicedb(s: string) {
  return s.replace(/:/g, '|').replace(/\./g, '+').replace(/~/g, '=');
}

export function spicedb2atproto(s: string) {
  return s.replace(/\|/g, ':').replace(/\+/g, '.').replace(/=/g, '~');
}
