package validations

import (
  "list"
  "strings"

  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/cases"
)

atbox: #validation & {

  let relns = list.Concat([
    cases.atbox.relns.setup,
    cases.atbox.relns.messages,
  ])
  relations: [ for r in relns {r[1]}]

  let checks = list.Concat([
    cases.atbox.checks.basic,
    cases.atbox.checks.records,
  ])
  asserts: {
    at: [ for c in checks if strings.TrimSpace(c[1]) == "true"     {c[2]}]
    af: [ for c in checks if strings.TrimSpace(c[1]) == "false"    {c[2]}]
    ac: [ for c in checks if strings.TrimSpace(c[1]) == "caveated" {c[2]}]
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
    for perm in ["space_create", "space_read", "record_create", "record_read"] {
      "\(_root)#\(perm)":[
        [_root, "owner", _boris],
      ]
    }

    // atbox
    for perm in ["space_create", "space_read", "record_read"] {
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
