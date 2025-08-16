package blebbit

import (
  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/utils"
)

// several servers, channels, threads, replies, reactions, pages
// -

case: utils.#case & {
  // subjects
  _tony:    "acct:tony"
  _boris:   "acct:boris"
  _paul:    "acct:paul"

  // root spaces
  _root:    "space:tony/root"

  // blebbit community
  _blebbit: "space:tony/blebbit"
  // blebbit channels
  _help:    "space:tony/blebbit-help"
  _mod:     "space:tony/blebbit-mod"

  // atdev community
  _atdev:   "space:tony/atdev"
  // atdev channels (what about grouping them like folders?)
  _admin:   "bubble:tony/atdev-admin"
  _general: "space:tony/atdev-general"
  _events:  "space:tony/atdev-events"
  _workgs:  "space:tony/atdev-workgs"

  // threads




  // hermits community (to test multiple communities)

  relns: {
    setup: [
      //
      // XXX this should support multiple relations for a single message
      //

      //
      // HMMM, how do we limit what NSID a subject has a relation to without N relations?
      // role/permission set

      // every account gets a root space
      ["  rooting tony   ",  [_root, "owner", _tony]],

      // blebbit spaces
      ["  community blebbit", [_blebbit, "parent", _root]],
      ["    channel help   ", [_help,    "parent", _blebbit]],
      ["    channel mod    ", [_mod,     "parent", _blebbit]],

      // atdev space and channels
      ["  community atdev  ", [_atdev,   "parent", _root]],
      ["    channel admins ", [_admin,  "parent", _atdev]],
      ["    channel general", [_general, "parent", _atdev]],
      ["    channel events ", [_events,  "parent", _atdev]],
      ["    channel workgs ", [_workgs,  "parent", _atdev]],
      ["  add atdev owner  ", [_atdev,   "owner",  _boris]]

    ]

  }

  checks: {
    basic: [
      // root space checks
      ["  root owners", ["true",  [_root,    "owners", _tony]]],
      ["  root owners", ["false", [_root,    "owners", _boris]]],

      // atdev space checkd
      ["  atdev owners", ["true",  [_atdev, "owners", _tony]]],
      ["  atdev owners", ["true",  [_atdev, "owners", _boris]]],
    ]


  }

  subcases: {
    default: [
      #"echo "blebbit/default - setup""#,
      (utils.#relationTo.touchMany & { input: relns.setup }).output,

      #"echo "atbox/default - basic checks""#,
      (utils.#relationTo.checkMany & { input: checks.basic }).output,
    ]
  }

}


