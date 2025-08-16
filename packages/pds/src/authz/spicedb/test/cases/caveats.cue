package cases

import (
  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/util"
)

case: caveats: #case & {
  _jay: "acct:jay"
  _paul: "acct:paul"
  _bryan: "acct:bryan"
  _devin: "acct:devin"
  _dholms: "acct:dholms"
  _hailey: "acct:hailey"
  _root: "space:jay/root"
  _space: "space:jay/case-caveats"
  _record: "space:jay/case-caveats/bsky_post/hello"
  _like: "space:jay/case-caveats/bsky_like/hello"


  relns: {
    seeding: [
      ["  rooting jay...", [_root, "owner", _jay]]
    ]
    setup: [
      // create the space
      ["  create work space", [_space, "parent", _root]],

      // direct members get read-only to all records
      ["  add member", [_space, "direct_member", _paul]],
      ["  grant permission", [_space, "record_lister", "\(_space)#member"]],

      // specific users get caveats
      ["  add a caveat", [_space, "record_lister", _bryan, #"nsids:{"allowed": ["bsky_post","bsky_like"]}"#]],
      ["  add a caveat", [_space, "record_lister", _devin, #"nsids:{"allowed": ["bsky_post"]}"#]],
    ]

    content: [
      ["  create a record", [_space, "parent", _record]],
      ["  create a record", [_space, "parent", _like]],

    ]
  }

  checks: {
    basic: [
      // root space checks
      ["  root owners", "true ", [_root, "owners", _jay]],
      ["  root owners", "false", [_root, "owners", _paul]],
      ["  root member", "true ", [_root, "member", _jay]],
      ["  root member", "false", [_root, "member", _paul]],
      ["  read record", "true ", [_root, "record_read", _jay]],
      ["  read record", "false", [_root, "record_read", _paul]],

      // work space checks
      ["  work owners", "true ", [_space, "owners", _jay]],
      ["  work owners", "false", [_space, "owners", _paul]],
      ["  work member", "true ", [_space, "member", _jay]],
      ["  work member", "true ", [_space, "member", _paul]],
      ["  read record", "true ", [_space, "record_read", _jay]],
      ["  read record", "true ", [_space, "record_read", _paul]],
      ["  read record", "false", [_space, "record_read", _hailey]],
    ]

    caveats: [
      ["  read record", "caveated", [_space, "record_read", _bryan]],
      ["  read record", "true    ", [_space, "record_read", _bryan, #"{"nsid": "bsky_post"}"#]],
      ["  read record", "false   ", [_space, "record_read", _bryan, #"{"nsid": "bsky_blob"}"#]],

    ]
  }

  subcases: {
    default: [
      #"echo "caveats/default - seeding""#,
      (util.#relationTo.touchMany & { input: relns.seeding }).output,

      #"echo "caveats/default - setup""#,
      (util.#relationTo.touchMany & { input: relns.setup }).output,

      #"echo "caveats/default - content""#,
      (util.#relationTo.touchMany & { input: relns.content }).output,

      #"echo "caveats/default - basic checks""#,
      (util.#relationTo.checkMany & { input: checks.basic }).output,

      #"echo "caveats/default - caveat checks""#,
      (util.#relationTo.checkMany & { input: checks.caveats }).output,
    ]
  }
}
