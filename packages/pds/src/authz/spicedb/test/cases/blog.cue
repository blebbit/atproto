package cases

import (
  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/utils"
)

case: blog: utils.#case & {
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
      ["  anyone can read in blog", [_blog, "record_viewer",  "anon:*",           #"nsids:{"default":false, "allowed":{"blog_post":true, "blog_comment":true}}"#]],
      ["  logins can read in blog", [_blog, "record_viewer",  "acct:*",           #"nsids:{"default":false, "allowed":{"blog_post":true, "blog_comment":true}}"#]],
      ["  logins can add comments", [_blog, "record_creator", "acct:*",           #"nsids:{"default":false, "allowed":{"blog_comment":true}}"#]],
      ["  friends can read drafts", [_blog, "record_viewer",  "\(_group)#member", #"nsids:{"default":false, "allowed":{"blog_draft":true, "blog_review":true}}"#]],
      ["  friends can add reviews", [_blog, "record_editor",  "\(_group)#member", #"nsids:{"default":false, "allowed":{"blog_review":true}}"#]],
    ]

    content: [
      // create content (owner is also assigned here, i.e. acct can edit/delete their comments, caveats can restrict futher)
      ["  create blog post   ", [_post,    "parent", _blog]],
      ["  create comment     ", [_comment, "parent", _blog]],
      ["  comment owner      ", [_comment, "owner",  _btrfy]],
      ["  create draft post  ", [_draft,   "parent", _blog]],
      ["  create draft review", [_review,  "parent", _blog]],
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
      ["  space owners", ["true",     [_blog, "owners", _alice]]],
      ["  space member", ["false",    [_blog, "member", _btrfy]]],
      ["  space member", ["false",    [_blog, "member", _darth]]],
      ["  space create", ["true",     [_blog, "record_create", _alice]]],
      ["  space create", ["caveated", [_blog, "record_create", _btrfy]]],
      ["  space create", ["caveated", [_blog, "record_create", _darth]]],
      ["  space create", ["false",    [_blog, "record_create", "anon:guest"]]],
      ["  space get   ", ["caveated", [_blog, "record_get",    _btrfy]]],
      ["  space get   ", ["caveated", [_blog, "record_get",    _darth]]],
      ["  space get   ", ["caveated", [_blog, "record_get",    "anon:guest"]]],
      ["  space create", ["caveated", [_blog, "record_create", _btrfy]]],
      ["  space create", ["caveated", [_blog, "record_create", _darth]]],
      ["  space create", ["false",    [_blog, "record_create", "anon:guest"]]],
    ]

    records: [
      // record reading
      ["  post get     ", ["true",  [_post,    "record_get", _btrfy, #"{"nsid":"blog_post"}"#]]],
      ["  post get     ", ["true",  [_post,    "record_get", _darth, #"{"nsid":"blog_post"}"#]]],
      ["  post get     ", ["true",  [_post,    "record_get", "anon:guest", #"{"nsid":"blog_post"}"#]]],
      ["  comment get  ", ["true",  [_comment, "record_get", _btrfy, #"{"nsid":"blog_comment"}"#]]],
      ["  comment get  ", ["true",  [_comment, "record_get", _darth, #"{"nsid":"blog_comment"}"#]]],
      ["  comment get  ", ["true",  [_comment, "record_get", "anon:guest", #"{"nsid":"blog_comment"}"#]]],
      ["  draft get    ", ["true",  [_draft,   "record_get", _btrfy, #"{"nsid":"blog_draft"}"#]]],
      ["  draft get    ", ["false", [_draft,   "record_get", _darth, #"{"nsid":"blog_draft"}"#]]],
      ["  draft get    ", ["false", [_draft,   "record_get", "anon:guest", #"{"nsid":"blog_draft"}"#]]],
      ["  review get   ", ["true",  [_review,  "record_get", _btrfy, #"{"nsid":"blog_review"}"#]]],
      ["  review get   ", ["false", [_review,  "record_get", _darth, #"{"nsid":"blog_review"}"#]]],
      ["  review get   ", ["false", [_review,  "record_get", "anon:guest", #"{"nsid":"blog_review"}"#]]],

      // comment capabilities
      ["  comment create", ["false", [_blog,    "record_create",   "anon:guest", #"{"nsid":"blog_comment"}"#]]],
      ["  comment create", ["true",  [_blog,    "record_create",   _darth, #"{"nsid":"blog_comment"}"#]]],
      ["  comment update", ["false", [_comment, "record_update",   _darth, #"{"nsid":"blog_comment"}"#]]],
      ["  comment delete", ["false", [_comment, "record_delete",   _darth, #"{"nsid":"blog_comment"}"#]]],
      ["  comment create", ["true",  [_blog,    "record_create",   _btrfy, #"{"nsid":"blog_comment"}"#]]],
      ["  comment update", ["true",  [_comment, "record_update",   _btrfy, #"{"nsid":"blog_comment"}"#]]],
      ["  comment delete", ["true",  [_comment, "record_delete",   _btrfy, #"{"nsid":"blog_comment"}"#]]],

      // review capabilities
      ["  review create ", ["false", [_draft,   "record_create",   "anon:guest", #"{"nsid":"blog_review"}"#]]],
      ["  review create ", ["false", [_draft,   "record_create",   _darth, #"{"nsid":"blog_review"}"#]]],
      ["  review create ", ["true",  [_draft,   "record_create",   _btrfy, #"{"nsid":"blog_review"}"#]]],
      ["  review update ", ["true",  [_review,  "record_update",   _btrfy, #"{"nsid":"blog_review"}"#]]],
      ["  review delete ", ["false", [_review,  "record_delete",   _btrfy, #"{"nsid":"blog_review"}"#]]],
    ]
  }

  subcases: {
    default: [
      #"echo "basics/default - seeding setup""#,
      (utils.#relationTo.touchMany & { input: relns.setup }).output,

      #"echo "basics/default - seeding content""#,
      (utils.#relationTo.touchMany & { input: relns.content }).output,

      #"echo "basics/default - basic checks""#,
      (utils.#relationTo.checkMany & { input: checks.basic }).output,

      #"echo "basics/default - record checks""#,
      (utils.#relationTo.checkMany & { input: checks.records }).output,
    ]
  }
}
