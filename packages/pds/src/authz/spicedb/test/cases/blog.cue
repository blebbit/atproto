package cases

import (
  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/util"
)

case: blog: #case & {
  _alice:   "acct:alice"
  _btrfy:   "acct:btrfy"
  _darth:   "acct:darth"
  _root:    "space:alice/root"
  _blog:    "space:alice/leaflet"
  _group:   "group:alice/leaflet/at_group/editors"
  _post:    "record:alice/leaflet/blog_post/hello-world"
  _comment: "record:alice/leaflet/blog_comment/good-read"
  _draft:   "record:alice/leaflet/blog_draft/title-wip"
  _review:  "record:alice/leaflet/blog_review/small-nit"


  relns: {
    setup: [
      // create spaces
      ["  acct owns root",    [_root, "owner", _alice]],
      ["  create blog space", [_blog, "parent", _root]],

      // create group
      ["  create group", [_group, "parent", _blog]],
      ["    add member", [_group, "direct_member", _btrfy]],

      // setup permissions
      ["  anyone can read in blog", [_blog, "record_lister",     "anon:*",           #"nsids:{"allowed":["blog_post", "blog_comment"]}"#]],
      ["  logins can read in blog", [_blog, "record_lister",     "acct:*",           #"nsids:{"allowed":["blog_post", "blog_comment"]}"#]],
      ["  logins can add comments", [_blog, "subrecord_creator", "acct:*",           #"nsids:{"allowed":["blog_comment"]}"#]],
      ["  friends can read drafts", [_blog, "record_lister",     "\(_group)#member", #"nsids:{"allowed":["blog_draft", "blog_review"]}"#]],
      ["  friends can add reviews", [_blog, "subrecord_updater", "\(_group)#member", #"nsids:{"allowed":["blog_review"]}"#]],
    ]

    content: [
      // create content (owner is also assigned here, i.e. acct can edit/delete their comments, caveats can restrict futher)
      ["  create blog post   ", [_post,    "parent", _blog]],
      ["  create comment     ", [_comment, "parent", _post]],
      ["  comment owner      ", [_comment, "owner",  _btrfy]],
      ["  create draft post  ", [_draft,   "parent", _blog]],
      ["  create draft review", [_review,  "parent", _draft]],
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
      ["  space owners", "true ", [_blog, "owners", _alice]],
      ["  space member", "false", [_blog, "member", _btrfy]],
      ["  space member", "false", [_blog, "member", _darth]],
      ["  space create", "true ", [_blog, "record_create", _alice]],
      ["  space create", "false", [_blog, "record_create", _btrfy]],
      ["  space create", "false", [_blog, "record_create", _darth]],
      ["  space create", "false", [_blog, "record_create", "anon:guest"]],
      ["  space read  ", "caveated", [_blog, "record_read",   _btrfy]],
      ["  space read  ", "caveated", [_blog, "record_read",   _darth]],
      ["  space read  ", "caveated", [_blog, "record_read",   "anon:guest"]],
      ["  space create", "caveated", [_blog, "subrecord_create", _btrfy]],
      ["  space create", "caveated", [_blog, "subrecord_create", _darth]],
      ["  space create", "false   ", [_blog, "subrecord_create", "anon:guest"]],
    ]

    records: [
      // record reading
      ["  post read     ", "true ", [_post,    "record_read", _btrfy, #"{"nsid":"blog_post"}"#]],
      ["  post read     ", "true ", [_post,    "record_read", _darth, #"{"nsid":"blog_post"}"#]],
      ["  post read     ", "true ", [_post,    "record_read", "anon:guest", #"{"nsid":"blog_post"}"#]],
      ["  comment read  ", "true ", [_comment, "record_read", _btrfy, #"{"nsid":"blog_comment"}"#]],
      ["  comment read  ", "true ", [_comment, "record_read", _darth, #"{"nsid":"blog_comment"}"#]],
      ["  comment read  ", "true ", [_comment, "record_read", "anon:guest", #"{"nsid":"blog_comment"}"#]],
      ["  draft read    ", "true ", [_draft,   "record_read", _btrfy, #"{"nsid":"blog_draft"}"#]],
      ["  draft read    ", "false", [_draft,   "record_read", _darth, #"{"nsid":"blog_draft"}"#]],
      ["  draft read    ", "false", [_draft,   "record_read", "anon:guest", #"{"nsid":"blog_draft"}"#]],
      ["  review read   ", "true ", [_review,  "record_read", _btrfy, #"{"nsid":"blog_review"}"#]],
      ["  review read   ", "false", [_review,  "record_read", _darth, #"{"nsid":"blog_review"}"#]],
      ["  review read   ", "false", [_review,  "record_read", "anon:guest", #"{"nsid":"blog_review"}"#]],

      // comment capabilities
      ["  comment create", "false", [_blog,    "subrecord_create",   "anon:guest", #"{"nsid":"blog_comment"}"#]],
      ["  comment create", "true ", [_blog,    "subrecord_create",   _darth, #"{"nsid":"blog_comment"}"#]],
      ["  comment update", "false", [_comment, "subrecord_update",   _darth, #"{"nsid":"blog_comment"}"#]],
      ["  comment delete", "false", [_comment, "subrecord_delete",   _darth, #"{"nsid":"blog_comment"}"#]],
      ["  comment create", "true ", [_blog,    "subrecord_create",   _btrfy, #"{"nsid":"blog_comment"}"#]],
      ["  comment update", "true ", [_comment, "subrecord_update",   _btrfy, #"{"nsid":"blog_comment"}"#]],
      ["  comment delete", "true ", [_comment, "subrecord_delete",   _btrfy, #"{"nsid":"blog_comment"}"#]],

      // review capabilities
      ["  review create ", "false", [_draft,   "subrecord_create",   "anon:guest", #"{"nsid":"blog_review"}"#]],
      ["  review create ", "false", [_draft,   "subrecord_create",   _darth, #"{"nsid":"blog_review"}"#]],
      ["  review create ", "true ", [_draft,   "subrecord_create",   _btrfy, #"{"nsid":"blog_review"}"#]],
      ["  review update ", "true ", [_review,  "subrecord_update",   _btrfy, #"{"nsid":"blog_review"}"#]],
      ["  review delete ", "false", [_review,  "subrecord_delete",   _btrfy, #"{"nsid":"blog_review"}"#]],
    ]
  }

  subcases: {
    default: [
      #"echo "basics/default - seeding setup""#,
      (util.#relationTo.touchMany & { input: relns.setup }).output,

      #"echo "basics/default - seeding content""#,
      (util.#relationTo.touchMany & { input: relns.content }).output,

      #"echo "basics/default - basic checks""#,
      (util.#relationTo.checkMany & { input: checks.basic }).output,

      #"echo "basics/default - record checks""#,
      (util.#relationTo.checkMany & { input: checks.records }).output,
    ]
  }
}
