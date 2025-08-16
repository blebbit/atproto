package cases

import (
  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/utils"
)

case: basics: utils.#case & {
  _alice:   "acct:alice"
  _btrfy:   "acct:btrfy"
  _darth:   "acct:darth"
  _root:    "space:alice/root"
  _space:   "space:alice/bsky"
  _bubble:  "bubble:alice/private"
  _group:   "group:alice/bsky/at_group/friends"
  _record:  "record:alice/bsky/bsky_post/hello-world"
  _message: "record:alice/private/bsky_post/hey-friends"
  _comment: "record:alice/bsky/bsky_post/very-nice"


  relns: {
    setup: [
      // create spaces
      ["  acct owns root",    [_root, "owner", _alice]],
      ["  create bsky space", [_space, "parent", _root]],
      ["  and nested bubble", [_bubble, "parent", _space]],

      // create group
      ["  create group", [_group, "parent", _space]],
      ["    add member", [_group, "direct_member", _btrfy]],

      // handle permissions
      ["  all accts can read in bsky ", [_space,  "record_viewer",  "acct:*"]],
      ["  friends can create in bsky ", [_space,  "record_creator", "\(_group)#member"]],
      ["  friends can read in private", [_bubble, "record_viewer",  "\(_group)#member"]],

      // create content
      ["  create bsky    post", [_record,  "parent", _space]],
      ["  create bsky comment", [_comment, "parent", _space]],
      ["  create private post", [_message, "parent", _bubble]],
    ]
  }

  checks: {
    basic: [
      // root access
      ["  root owners", ["true",  [_root, "owners", _alice]]],
      ["  root member", ["false", [_root, "member", _btrfy]]],
      ["  root member", ["false", [_root, "member", _darth]]],
      ["  root get   ", ["false", [_root, "record_get", _btrfy]]],
      ["  root get   ", ["false", [_root, "record_get", _darth]]],

      // space access
      ["  space owners", ["true",  [_space, "owners", _alice]]],
      ["  space member", ["false", [_space, "member", _btrfy]]],
      ["  space member", ["false", [_space, "member", _darth]]],
      ["  space create", ["true",  [_space, "record_create", _btrfy]]],
      ["  space create", ["false", [_space, "record_create", _darth]]],
      ["  space get   ", ["true",  [_space, "record_get",    _btrfy]]],
      ["  space get   ", ["true",  [_space, "record_get",    _darth]]],

      // bubble access
      ["  bubble owners", ["true",  [_bubble, "owners", _alice]]],
      ["  bubble member", ["false", [_bubble, "member", _btrfy]]],
      ["  bubble member", ["false", [_bubble, "member", _darth]]],
      ["  bubble create", ["false", [_bubble, "record_create", _btrfy]]],
      ["  bubble create", ["false", [_bubble, "record_create", _darth]]],
      ["  bubble get  ", ["true",   [_bubble, "record_get",   _btrfy]]],
      ["  bubble get  ", ["false",  [_bubble, "record_get",   _darth]]],
    ]

    records: [
      // record capabilities
      ["  record get ",     ["true",  [_record,  "record_get",    _btrfy]]],
      ["  record get ",     ["true",  [_record,  "record_get",    _darth]]],
      ["  comment get",     ["true",  [_comment, "record_get",    _btrfy]]],
      ["  comment get",     ["true",  [_comment, "record_get",    _darth]]],
      ["  message get",     ["true",  [_message, "record_get",    _btrfy]]],
      ["  message get",     ["false", [_message, "record_get",    _darth]]],
      ["  record nesting",  ["true",  [_record,  "record_create", _btrfy]]],
      ["  record nesting",  ["false", [_record,  "record_create", _darth]]],
      ["  message nesting", ["false", [_message, "record_create", _btrfy]]],
      ["  message nesting", ["false", [_message, "record_create", _darth]]],
    ]
  }

  subcases: {
    default: [
      #"echo "basics/default - setup""#,
      (utils.#relationTo.touchMany & { input: relns.setup }).output,

      #"echo "basics/default - basic checks""#,
      (utils.#relationTo.checkMany & { input: checks.basic }).output,

      #"echo "basics/default - record checks""#,
      (utils.#relationTo.checkMany & { input: checks.records }).output,
    ]
  }
}
