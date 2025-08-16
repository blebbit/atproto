package validations

import (
  "list"

  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/cases"
)

atbox: #validation & {

  let rs = list.Concat([
    cases.case.atbox.relns.setup,
    cases.case.atbox.relns.messages,
  ])
  relations: [ for r in rs {r[1]}]

  let cs = list.Concat([
    cases.case.atbox.checks.basic,
    cases.case.atbox.checks.records,
  ])
  checks: [ for c in cs { c[1] }]
  asserts: {
    at: [ for c in checks if c[0] == "true"     {c[1]}]
    af: [ for c in checks if c[0] == "false"    {c[1]}]
    ac: [ for c in checks if c[0] == "caveated" {c[1]}]
  }

  // TODO, get the data from the case.atbox too... it's just nice to read single tokens
  // subjects
  _boris: "acct:boris"
  _nick: "acct:nick"
  _tony: "acct:tony"
  _rudy: "acct:rudy"
  _trusted: "group:boris/atbox/trusted"
  _sender:  "role:boris/atbox/sender"

  // content
  _root:   "space:boris/root"
  _atbox:  "space:boris/atbox"
  _atmsg:  "record:boris/atbox"
  _atblob: "blob:boris/atbox"
  _msg1:   "\(_atmsg)/atbox_msg/hello"
  _msg2:   "\(_atmsg)/atbox_doc/draft"
  _msg3:   "\(_atmsg)/bsky_post/share"
  _pdf1:   "\(_atblob)/atbox_attachment/pdf1"


  validate: {
    // root space
    for perm in ["space_create", "space_get", "record_create", "record_get"] {
      "\(_root)#\(perm)":[
        [_root, "owner", _boris],
      ]
    }

    // atbox
    for perm in ["space_create", "space_get", "record_get"] {
      "\(_root)#\(perm)": [
        [_root, "owner", _boris],
      ]
    }
    "\(_atbox)#record_create": [
      [_root, "owner", _boris],
      [_atbox, "record_creator", "acct:*"],
    ]
    "\(_atbox)#blob_create": [
      [_root, "owner", _boris],
      ["\(_trusted)", "direct_member", _nick],
      [_atbox, "blob_creator", "\(_trusted)#member"],
    ]
    "\(_trusted)#member": [
      [_root, "owner", _boris],
      [_trusted, "direct_member", _nick],
    ]
  }
}
