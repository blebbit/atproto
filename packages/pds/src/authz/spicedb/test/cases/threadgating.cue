package cases

import (
  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/utils"
)

// enforcable threadgating on a bsky like system
case: threadgating: utils.#case & {
  // subjects
  _jay:   "acct:jay"
  _paul:  "acct:paul"
  _bryan: "acct:bryan"

  // spaces / bubbles
  _root:  "space:jay/root"
  _bsky:  "space:jay/bsky"
  _gated: "bubble:jay/gated"

  // groups / roles
  _group: "group:jay/bsky/at_group/friends"

  // records
  _public:  "record:jay/bsky/bsky_post/public"
  _private: "record:jay/gated/bsky_post/gated"

  // named relations lists
  relns: {
    setup: [
      // accts all get a root account
      ["  rooting jay...", [_root, "owner", _jay]],

      // public bsky space
      ["  creating bsky", [_bsky, "parent", _root]],
      ["    anon access", [
        [_bsky, "record_viewer", "anon:*"],
        [_bsky, "blob_getter",   "anon:*"],
      ]],
      ["    acct access", [
        [_bsky, "record_viewer", "acct:*"],
        [_bsky, "blob_getter",   "acct:*"],
      ]],

      // gated bsky bubble (login to read)
      ["  create gated",  [_gated, "parent", _bsky]],
      ["    acct access", [
        [_gated, "record_viewer", "acct:*"],
        [_gated, "blob_getter",   "acct:*"],
      ]],

      // group access to bubble (can comment)
      ["  creating group",  [_group, "parent", _root]],
      ["    add members",   [
        [_group, "direct_member", _paul],
      ]],
      ["    member access", [
        [_bsky,  "record_creator", "\(_group)#member"],
        [_bsky,  "blob_creator",   "\(_group)#member"],
        [_gated, "record_creator", "\(_group)#member"],
        [_gated, "blob_creator",   "\(_group)#member"],
      ]],
    ]
    content: [
      ["  public record",  [_public,  "parent", _bsky]],
      ["  gated  record",  [_private, "parent", _gated]],
    ]
  }

  // named check lists
  checks: {
    root_space: [
      ["  get record",   ["true",  [_root, "record_get", _jay]]],
      ["  get record",   ["false", [_root, "record_get", _paul]]],
      ["  get record",   ["false", [_root, "record_get", _bryan]]],
      ["  get record",   ["false", [_root, "record_get", "anon:any"]]],
    ]

    bsky_space: [
      ["  get record",   [
        ["true",  [_bsky, "record_get", _jay]],
        ["true",  [_bsky, "record_get", _paul]],
        ["true",  [_bsky, "record_get", _bryan]],
        ["true",  [_bsky, "record_get", "anon:any"]],
      ]],
      ["  create record",   [
        ["true",  [_bsky, "record_create", _jay]],
        ["true",  [_bsky, "record_create", _paul]],
        ["false", [_bsky, "record_create", _bryan]],
        ["false", [_bsky, "record_create", "anon:any"]],
      ]],
    ]

    gated_bubble: [
      ["  get record",   [
        ["true",  [_gated, "record_get", _jay]],
        ["true",  [_gated, "record_get", _paul]],
        ["true",  [_gated, "record_get", _bryan]],
        ["false", [_gated, "record_get", "anon:any"]],
      ]],
      ["  create record",   [
        ["true",  [_gated, "record_create", _jay]],
        ["true",  [_gated, "record_create", _paul]],
        ["false", [_gated, "record_create", _bryan]],
        ["false", [_gated, "record_create", "anon:any"]],
      ]],
    ]
  }

  subcases: {
    default: [
      //
      // Relations
      //
      #"echo "threadgating/default - setup""#,
      (utils.#relationTo.touchMany & { input: relns.setup }).output,

      #"echo "threadgating/default - content""#,
      (utils.#relationTo.touchMany & { input: relns.content }).output,

      //
      // Checks
      //
      #"echo "threadgating/default - checks: root_space""#,
      (utils.#relationTo.checkMany & { input: checks.root_space }).output,

      #"echo "threadgating/default - checks: bsky_space""#,
      (utils.#relationTo.checkMany & { input: checks.bsky_space }).output,

      #"echo "threadgating/default - checks: gated_bubble""#,
      (utils.#relationTo.checkMany & { input: checks.gated_bubble }).output,
    ]
  }
}
