package cases

import (
  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/utils"
)

case: caveats: utils.#case & {
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
      ["  grant permission", [_space, "record_viewer", "\(_space)#member"]],

      // specific users get caveats
      ["  caveat bryan", [_space, "record_viewer", _bryan,  #"nsids:{"default": false, "allowed": {"bsky_post":true,"bsky_like":true}}"#]],
      ["  caveat devin", [_space, "record_viewer", _devin,  #"nsids:{"allowed": {"bsky_post":true}}"#]],
    ]

    content: [
      ["  create a record", [_space, "parent", _record]],
      ["  create a record", [_space, "parent", _like]],
    ]
  }

  checks: {
    basic: [
      // root space checks
      ["  root owners", ["true",  [_root, "owners", _jay]]],
      ["  root owners", ["false", [_root, "owners", _paul]]],
      ["  root member", ["true",  [_root, "member", _jay]]],
      ["  root member", ["false", [_root, "member", _paul]]],
      ["  get record ", ["true",  [_root, "record_get", _jay]]],
      ["  get record ", ["false", [_root, "record_get", _paul]]],

      // work space checks
      ["  work owners", ["true",  [_space, "owners", _jay]]],
      ["  work owners", ["false", [_space, "owners", _paul]]],
      ["  work member", ["true",  [_space, "member", _jay]]],
      ["  work member", ["true",  [_space, "member", _paul]]],
      ["  get record ", ["true",  [_space, "record_get", _jay]]],
      ["  get record ", ["true",  [_space, "record_get", _paul]]],
      ["  get record ", ["false", [_space, "record_get", _hailey]]],
    ]

    caveats: [
      ["  get record", ["caveated", [_space, "record_get", _bryan]]],
      ["  get record", ["true",     [_space, "record_get", _bryan, #"{"nsid": "bsky_post"}"#]]],
      ["  get record", ["false",    [_space, "record_get", _bryan, #"{"nsid": "bsky_blob"}"#]]],
      ["  get record", ["false",    [_space, "record_get", _bryan, #"{"nsid": "bsky_blob", "default": true}"#]]], // cannot change during check

      ["  get record", ["caveated", [_space, "record_get", _devin]]],
      ["  get record", ["true",     [_space, "record_get", _devin, #"{"nsid": "bsky_post"}"#]]],
      ["  get record", ["caveated", [_space, "record_get", _devin, #"{"nsid": "bsky_blob"}"#]]],
      ["  get record", ["true",     [_space, "record_get", _devin, #"{"nsid": "bsky_blob", "default": true}"#]]],
      ["  get record", ["false",    [_space, "record_get", _devin, #"{"nsid": "bsky_blob", "default": false}"#]]],
    ]

    postChange: [
      ["  get record", ["caveated", [_space, "record_get", _bryan]]],
      ["  get record", ["true",     [_space, "record_get", _bryan, #"{"nsid": "bsky_post"}"#]]],
      ["  get record", ["true",     [_space, "record_get", _bryan, #"{"nsid": "bsky_blob"}"#]]],

      ["  get record", ["false",    [_space, "record_get", _devin]]],
    ]
  }

  freeform: {
    change: [
      ["  re-caveat bryan", [_space, "record_viewer", _bryan,  #"nsids:{"default": false, "allowed": {"bsky_post":true,"bsky_like":true,"bsky_blob":true}}"#]],
      ["  de-relate devin", (utils.#relationTo.deleteReln & { i: [_space, "record_viewer", _devin]}).o],
    ]
  }

  subcases: {
    default: [
      #"echo "caveats/default - seeding""#,
      (utils.#relationTo.touchMany & { input: relns.seeding }).output,

      #"echo "caveats/default - setup""#,
      (utils.#relationTo.touchMany & { input: relns.setup }).output,

      #"echo "caveats/default - content""#,
      (utils.#relationTo.touchMany & { input: relns.content }).output,

      #"echo "caveats/default - basic checks""#,
      (utils.#relationTo.checkMany & { input: checks.basic }).output,

      #"echo "caveats/default - caveat checks""#,
      (utils.#relationTo.checkMany & { input: checks.caveats }).output,

      #"echo "caveats/default - change permissions""#,
      (utils.#relationTo.freeformMany & { input: freeform.change }).output,

      #"echo "caveats/default - change checks""#,
      (utils.#relationTo.checkMany & { input: checks.postChange }).output,
    ]
  }
}
