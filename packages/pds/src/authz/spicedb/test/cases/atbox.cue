package cases

import (
  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/utils"
)

case: atbox: utils.#case & {

  input: {
    seed: flags.seed
    subcase: flags.subcase
  }

  // subjects
  _boris:   "acct:boris"
  _nick:    "acct:nick"
  _tony:    "acct:tony"
  _rudy:    "acct:rudy"
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

  // TODO, add subspaces to "put messages in folders"
  //       and restrict who can write to different folders
  //       (open to all, just people I trust, purchases)
  // TODO, add "delete until accessed" (or replied) example flow


  relns: {
    setup: [
      // every account gets a root space
      ["  rooting boris",  [_root, "owner", _boris]],

      // create the atbox
      ["  creating atbox", [_atbox, "parent", _root]],

      // create trusted group
      ["  creating trusted group", [_trusted, "parent", _atbox]],
      ["    adding member", [_trusted, "direct_member", _nick]],

      // any atproto account can write (send a message)
      ["  authd messages", [_atbox, "record_creator", "acct:*"]],
      ["  trusted blobs ", [_atbox, "blob_creator", "\(_trusted)#member"]],
    ]

    // create three messages, sender maintains access
    messages: [
      ["  create msg1",    [_msg1, "parent", _atbox]],
      ["    msg1 perms",   [_msg1, "record_editor", "\(_msg1)#member"]],
      ["    msg1 perms",   [_msg1, "record_getter", "\(_msg1)#member"]],
      ["    msg1 member",  [_msg1, "direct_member", _nick]],
      ["    upload pdf1",  [_pdf1, "parent", _atbox]],
      ["    pdf1 perms",   [_pdf1, "blob_editor", "\(_msg1)#member"]],
      ["    pdf1 perms",   [_pdf1, "blob_viewer", "\(_msg1)#member"]],

      ["  create msg2",    [_msg2, "parent", _atbox]],
      ["    msg2 perms",   [_msg2, "record_editor", "\(_msg2)#member"]],
      ["    msg2 perms",   [_msg2, "record_getter", "\(_msg2)#member"]],
      ["    send perms",   [_msg2, "direct_member", _tony]],

      ["  create msg3",    [_msg3, "parent", _atbox]],
      ["    msg3 perms",   [_msg3, "record_editor", "\(_msg3)#member"]],
      ["    msg3 perms",   [_msg3, "record_getter", "\(_msg3)#member"]],
      ["    send perms",   [_msg3, "direct_member", _rudy]],
    ]
  }

  checks: {
    basic: [
      // root space checks
      ["  root owners", ["true",  [_root, "owners", _boris]]],
      ["  root owners", ["false", [_root, "owners", _nick]]],
      ["  root member", ["true",  [_root, "member", _boris]]],
      ["  root member", ["false", [_root, "member", _nick]]],
      ["  read record", ["true",  [_root, "record_get", _boris]]],
      ["  read record", ["false", [_root, "record_get", _nick]]],

      // atbox space checks
      ["  atbox owners", ["true",  [_atbox, "owners", _boris]]],
      ["  atbox owners", ["false", [_atbox, "owners", _nick]]],
      ["  atbox member", ["true",  [_atbox, "member", _boris]]],
      ["  atbox member", ["false", [_atbox, "member", _nick]]],

      // atbox record access
      ["  list atbox", ["true",  [_atbox, "record_list", _boris]]],
      ["  list atbox", ["false", [_atbox, "record_list", _nick]]],
      ["  read atbox", ["true",  [_atbox, "record_get",  _boris]]],
      ["  read atbox", ["false", [_atbox, "record_get",  _nick]]],
    ]

    records: [
      // atbox record create
      ["  create msg", ["true", [_atbox, "record_create", _boris]]],
      ["  create msg", ["true", [_atbox, "record_create", _nick]]],
      ["  create msg", ["true", [_atbox, "record_create", _tony]]],
      ["  create msg", ["true", [_atbox, "record_create", _rudy]]],

      // atbox blob create
      ["  create blob", ["true",  [_atbox, "blob_create", _boris]]],
      ["  create blob", ["true",  [_atbox, "blob_create", _nick]]],
      ["  create blob", ["false", [_atbox, "blob_create", _tony]]],
      ["  create blob", ["false", [_atbox, "blob_create", _rudy]]],

      // update/delete own messages
      ["  update msg", ["true",  [_msg1, "record_update", _nick]]],
      ["  update msg", ["true",  [_msg2, "record_update", _tony]]],
      ["  update msg", ["true",  [_msg3, "record_update", _rudy]]],
      ["  delete msg", ["false", [_msg1, "record_delete", _nick]]],
      ["  delete msg", ["false", [_msg2, "record_delete", _tony]]],
      ["  delete msg", ["false", [_msg3, "record_delete", _rudy]]],

      // cannot read others messages
      ["  read other", ["false", [_msg2, "record_get", _nick]]],
      ["  read other", ["false", [_msg3, "record_get", _nick]]],
      ["  read other", ["false", [_msg1, "record_get", _tony]]],
      ["  read other", ["false", [_msg3, "record_get", _tony]]],
      ["  read other", ["false", [_msg1, "record_get", _rudy]]],
      ["  read other", ["false", [_msg2, "record_get", _rudy]]],

      // blob reading
      ["  read blob", ["true", [_pdf1, "blob_get", _boris]]],
      ["  read blob", ["true", [_pdf1, "blob_get", _nick]]],

    ]

  }

  subcases: {
    default: [
      #"echo "atbox/default - setup""#,
      (utils.#relationTo.touchMany & { input: relns.setup }).output,

      #"echo "atbox/default - messages""#,
      (utils.#relationTo.touchMany & { input: relns.messages }).output,

      #"echo "atbox/default - basic checks""#,
      (utils.#relationTo.checkMany & { input: checks.basic }).output,

      #"echo "atbox/default - record checks""#,
      (utils.#relationTo.checkMany & { input: checks.records }).output,
    ]
  }

}
