package cases

import (
  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/utils"
)

// Bluesky equivalent space
case: bluesky: utils.#case & {
  // subjects
  _jay:  "acct:jay"
  _paul: "acct:paul"

  // spaces / bubbles
  _root:  "space:jay/root"
  _bsky:  "space:jay/bsky"

  // named relations lists
  relns: {
    setup: [
      // accts all get a root space
      ["  rooting jay...", [_root, "owner", _jay]],

      // create a public space for bsky
      ["  creating bsky", [_bsky, "parent", _root]],
      // enable this to allow anonymous viewing
      // ["    anon access", [
      //   [_bsky, "record_viewer", "anon:*"],
      //   [_bsky, "blob_getter",   "anon:*"],
      // ]],
      // atproto account can access
      ["    acct access", [
        [_bsky, "record_viewer", "acct:*"],
        [_bsky, "blob_getter",   "acct:*"],
      ]],
    ]
  }

  // named check lists
  checks: {
    root_space: [
      ["  get record",   ["true",  [_root, "record_get", _jay]]],
      ["  get record",   ["true",  [_root, "record_get", _paul]]],
      ["  get record",   ["false", [_root, "record_get", "anon:any"]]],
    ]
  }

  subcases: {
    default: [
      //
      // Relations
      //
      #"echo "threadgating/default - setup""#,
      (utils.#relationTo.touchMany & { input: relns.setup }).output,

      //
      // Checks
      //
      #"echo "threadgating/default - checks: root_space""#,
      (utils.#relationTo.checkMany & { input: checks.root_space }).output,

    ]
  }
}
