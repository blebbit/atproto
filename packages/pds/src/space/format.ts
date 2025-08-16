import { AtUri } from "@atproto/syntax"

export function aturi2spicedb(uri: AtUri | string): string {
  // ensure uri is an AtUri instance
  if (typeof uri === 'string') {
    uri = new AtUri(uri)
  }

  // do char conversion
  const repo = atprotoToSpicedb(uri.hostname)
  const path = atprotoToSpicedb(uri.pathname) // nsid/rkey (if present)

  var sid = repo
  if (path !== "/") {
    sid += path
  }

  // make sid (spicedb "id")
  // console.log('aturi2spicedb', uri, '=>', sid)
  return sid
}

export function spicedb2aturi(sid: string): AtUri {
  // TODO: implement the conversion logic
  return new AtUri(`at://${spicedbToAtproto(sid)}}`)
}

function atprotoToSpicedb(s: string) {
  return s.replace(/:/g, '|').replace(/\./g, '+').replace(/~/g, '=');
}

function spicedbToAtproto(s: string) {
  return s.replace(/\|/g, ':').replace(/\+/g, '.').replace(/=/g, '~');
}
