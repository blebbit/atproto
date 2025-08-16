package cases

import (
  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/util"
)

case: basics: #case & {
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
      ["  all accts can read in bsky ", [_space,  "record_lister",  "acct:*"]],
      ["  friends can create in bsky ", [_space,  "record_creator", "\(_group)#member"]],
      ["  friends can read in private", [_bubble, "record_lister",  "\(_group)#member"]],

      // create content
      ["  create bsky    post", [_record, "parent", _space]],
      ["  create bsky comment", [_comment, "parent", _record]],
      ["  create private post", [_message, "parent", _bubble]],
    ]
  }

  checks: {
    basic: [
      // root access
      ["  root owners", "true ", [_root, "owners", _alice]],
      ["  root member", "false", [_root, "member", _btrfy]],
      ["  root member", "false", [_root, "member", _darth]],
      ["  root read  ", "false", [_root, "record_read", _btrfy]],
      ["  root read  ", "false", [_root, "record_read", _darth]],

      // space access
      ["  space owners", "true ", [_space, "owners", _alice]],
      ["  space member", "false", [_space, "member", _btrfy]],
      ["  space member", "false", [_space, "member", _darth]],
      ["  space create", "true ", [_space, "record_create", _btrfy]],
      ["  space create", "false", [_space, "record_create", _darth]],
      ["  space read  ", "true ", [_space, "record_read",   _btrfy]],
      ["  space read  ", "true ", [_space, "record_read",   _darth]],

      // bubble access
      ["  bubble owners", "true ", [_bubble, "owners", _alice]],
      ["  bubble member", "false", [_bubble, "member", _btrfy]],
      ["  bubble member", "false", [_bubble, "member", _darth]],
      ["  bubble create", "false", [_bubble, "record_create", _btrfy]],
      ["  bubble create", "false", [_bubble, "record_create", _darth]],
      ["  bubble read  ", "true ", [_bubble, "record_read",   _btrfy]],
      ["  bubble read  ", "false", [_bubble, "record_read",   _darth]],
    ]

    records: [
      // record capabilities
      ["  record read ",    "true ", [_record,  "record_read",   _btrfy]],
      ["  record read ",    "true ", [_record,  "record_read",   _darth]],
      ["  comment read",    "true ", [_comment, "record_read",   _btrfy]],
      ["  comment read",    "true ", [_comment, "record_read",   _darth]],
      ["  message read",    "true ", [_message, "record_read",   _btrfy]],
      ["  message read",    "false", [_message, "record_read",   _darth]],
      ["  record nesting",  "true ", [_record,  "record_create", _btrfy]],
      ["  record nesting",  "false", [_record,  "record_create", _darth]],
      ["  message nesting", "false", [_message, "record_create", _btrfy]],
      ["  message nesting", "false", [_message, "record_create", _darth]],
    ]
  }

  subcases: {
    default: [
      #"echo "basics/default - setup""#,
      (util.#relationTo.touchMany & { input: relns.setup }).output,

      #"echo "basics/default - basic checks""#,
      (util.#relationTo.checkMany & { input: checks.basic }).output,

      #"echo "basics/default - record checks""#,
      (util.#relationTo.checkMany & { input: checks.records }).output,
    ]
  }
}
