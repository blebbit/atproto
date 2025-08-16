package cases

import (
  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/util"
)

// several servers, channels, threads, replies, reactions, pages
// -

case: blebbit: #case & {
  // subjects
  _blebbit: "acct:blebbit"
  _tony:    "acct:tony"
  _boris:   "acct:boris"
  _paul:    "acct:paul"

  // root spaces
  _blebbit_root: "space:blebbit/root"
  _tony_root:    "space:tony/root"

  // blebbit common
  _space:  "space:blebbit/blebbit"
  _help:   "space:blebbit/help"
  _mod:    "space:blebbit/mod"

  // atdev community
  _atdev:   "space:blebbit/atdev"
  _general: "space:blebbit/general"
  _events:  "space:blebbit/events"
  _workgs:  "space:blebbit/workgs"

  // hermits community

  relns: {
    setup: [
      // every account gets a root space
      ["  rooting blebbit",  [_blebbit_root, "owner", _blebbit]],
      ["  rooting tony   ",  [_tony_root, "owner", _tony]],

      // blebbit spaces
      ["  parent blebbit", [_space, "parent", _blebbit_root]],
      ["  parent help   ", [_help,  "parent", _space]],
      ["  parent mod    ", [_mod,   "parent", _space]],

      // tony spaces
      ["  parent atdev    ", [_atdev, "parent", _tony_root]],
      ["    parent events ", [_events, "parent", _atdev]],
      ["    parent workgs ", [_workgs, "parent", _atdev]],
      ["  add atdev owner ", [_atdev, "owner", _boris]]

    ]

  }

  checks: {
    basic: [
      // root space checks
      ["  root owners", "true ", [_blebbit_root, "owners", _blebbit]],
      ["  root owners", "false", [_tony_root,    "owners", _blebbit]],
      ["  root owners", "false", [_blebbit_root, "owners", _tony]],
      ["  root owners", "true ", [_tony_root,    "owners", _tony]],

      // atdev space checkd
      ["  atdev owners", "true ", [_atdev, "owners", _tony]],
      ["  atdev owners", "true ", [_atdev, "owners", _boris]],
    ]


  }

  subcases: {
    default: [
      #"echo "blebbit/default - setup""#,
      (util.#relationTo.touchMany & { input: relns.setup }).output,

      #"echo "atbox/default - basic checks""#,
      (util.#relationTo.checkMany & { input: checks.basic }).output,
    ]
  }

}

