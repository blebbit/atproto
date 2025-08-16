package schema

import (
  "list"
  "strings"
)

spicedbSchema: strings.Join(list.FlattenN([
  _caveats,
  [ for s,_ in subjects { "definition \(s) {}"} ],
  [ for r in resources { r.schema } ],
],1), "\n\n")

_caveats: [
  """
  //
  // Caveats (CEL expressions)
  //

  // NSID filtering (think oauth permission sets and check)
  caveat nsids(allowed list<string>, nsid string) {
    nsid in allowed
  }
  """,
  // """
  // // Object matching (think looking for one tree in another, expected -> provided)
  // caveat context(expected map<any>, provided map<any>) {
  //   expected.isSubtreeOf(provided)
  // }
  // // we can do before with expiring relations
  // caveat before(t timestamp, curr timestamp) {
  //   curr < t
  // }
  // // after would need something to create it later (perhaps doable, certainly at the app layer)
  // caveat after(t timestamp, curr timestamp) {
  //   curr > t
  // }
  // """
]

subjects: {

  // i.e. PDS admin
  superuser: {}

  // no login available
  anon: {}

  // the account DID
  acct: {}

  // session/login specific
  oauth: {}

  // appviews, labelers, feedgen...
  service: {}

  // for automations and other authn methods
  apikey: {}
  svcacct: {}
  // keypair: {}

}

_subjs: [
  "acct",
  "oauth",
  "service",
  "apikey",
  "svcacct",
]
_wilds: [
  "acct:*",
  "oauth:*",
  "service:*",
]
_membs: [
  "space#member",
  "bubble#member",
  "group#member",
  "role#member",
]

_relnAll: (#relnFormat & { subjs: [ ["superuser"], _subjs, _membs ]}).output
_relnAllWild: (#relnFormat & { subjs: [ ["superuser"], _wilds, _subjs, _membs ]}).output
_relnAllWildAnon: (#relnFormat & { subjs: [ ["superuser", "anon:*"], _wilds, _subjs, _membs ]}).output

_relnRecordAll: (#relnFormat & { subjs: [ ["superuser", "record#member"], _subjs, _membs ]}).output
_relnRecordAllWild: (#relnFormat & { subjs: [ ["superuser", "record#member"], _wilds, _subjs, _membs ]}).output
_relnRecordAllWildAnon: (#relnFormat & { subjs: [ ["superuser", "record#member", "anon:*"], _wilds, _subjs, _membs ]}).output

_owner: strings.Join(list.FlattenN([
  _subjs,
  ["space#member", "group#member"]
],1), " | ")
_direct_member: strings.Join(list.FlattenN([
  _subjs,
  ["space#member", "bubble#member", "group#member"]
],1), " | ")

R=resources: {
  // template
  [r=string]: {
    _crud: #crud & { prefix: r }
    _iam: #iam & { prefix: r }
    relations: {

      // graph relations
      parent: string | *"space | bubble",
      owner: string | *_owner,

      // crud relations
      [
        if r == "rpc" {
          _crud.relationsRpc
          _iam.relations
        },
        if r == "record" {
          _crud.relationsRecord
          _iam.relationsRecord
        },
        {
          _crud.relations
          _iam.relations
        }
      ][0]
    }

    // handle special case for self permissions
    permissions: {

      owners: "owner + parent->owners"
      [
        if r == "rpc" {
          _crud.permissionsRpc
          _iam.permissions
        }
        if r == "bubble" {
          _crud.permissionsParentless
          _iam.permissionsParentless
        }
        {
          _crud.permissions
          _iam.permissions
        }
      ][0]
    }

    // build up the resource partial schema
    gen: #definitions & {
      name: r
      relns: relations
      perms: permissions
    }
    schema: gen.output
  }

  // HMMMMMMMMMM
  // do we merge space and record?
  // is that by using spaces and having a record
  // which informs the appview what kind of
  // "space-record" it is?
  // examples:
  // google docs, so unlimited nesting folders and content
  // discord, so both pub/prv channels and threads
  //
  // since we do have an unused record column in a space row
  // we could use that as the space "type"
  // in theory have a record too (they have an nsid)
  // it can be very open and underspecified for app uses
  // it often wants a displayName ?
  // but what about apps putting schemas on it
  // the $type: com.atproto.space.space
  //   so where do we put the "folder" vs "channel"
  //   depending on the app, so that it is easy to figure out
  //   and is tied to some lexicon
  //   should multiple apps be able to attach information?
  //   can we leave all of this up to the app, they could...
  //    - put all the details in the space record
  //    - use a ref to another record
  //    - not do anything and have another way to figure it out
  //    - multiple refs..., perhaps scoped by domain authority or nsid?
  //
  // main scoping / organization resource(s)
  //
  // spaces and bubbles are the same except
  // that bubbles break the chain of permissions
  // such that we can have a private "bubble"
  // within a larger access space.
  // as we nest spaces, those at the top
  // have the same permissions for everything under
  // Bubbles break this chain by not pointing back
  // to their parents for permission solving
  //
  space: {
    relations: {
      direct_member: _direct_member
      R.bubble._crud.relations
      R.bubble._iam.relations
      R.group.relations
      R.role.relations
      R.record._crud.relations
      R.record._iam.relations
      R.blob.relations
      R.rpc.relations
      extra.subrecord.relations
      extra.subblob.relations
    }
    permissions: {
      member: "owners + direct_member"
      R.bubble._crud.permissions
      R.bubble._iam.permissions
      R.group.permissions
      R.role.permissions
      R.record.permissions
      R.blob.permissions
      R.rpc.permissions
      extra.subrecord.permissions
      extra.subblob.permissions
    }
  }
  bubble: {
    relations: {
      direct_member: _direct_member
      R.space.relations
      // R.group.relations
      // R.role.relations
      // R.record._crud.relations
      // R.record._iam.relations
      // R.blob.relations
      // R.rpc.relations
      // extra.subrecord.relations
      // extra.subblob.relations
    }
    permissions: {
      member: "owners + direct_member"
      R.space._crud.permissionsParentless
      R.space._iam.permissionsParentless
      R.group._crud.permissionsParentless
      R.group._iam.permissionsParentless
      R.role._crud.permissionsParentless
      R.role._iam.permissionsParentless
      R.record._crud.permissionsParentless
      R.record._iam.permissionsParentless
      R.blob._crud.permissionsParentless
      R.blob._iam.permissionsParentless
      R.rpc._crud.permissionsRpcParentless
      R.rpc._iam.permissionsParentless
      extra.subrecord._iam.permissionsParentless
      extra.subblob._iam.permissionsParentless
    }
  }

  //
  // collections of accts / svcacct
  //
  group: {
    relations: {
      direct_member: _direct_member
    }
    permissions: {
      owners: "owner + parent->owners"
      member: "owners + direct_member"
    }
  }
  role: {
    relations: {
      direct_member: _direct_member
    }
    permissions: {
      owners: "owner + parent->owners"
      member: "owners + direct_member"
    }
  }

  //
  // content resources
  //

  record: {

    // relation overrides and extensions
    relations: {
      direct_member: _direct_member
      // this is the (recursive) magic that let's us "nest" nsids
      // do we need something for current record perms vs sub-record?
      parent: "space | bubble"

      // need blobs since they can nest now
      // R.blob.relations
      R.blob._crud.relationsRecord
      R.blob._iam.relationsRecord
      // extra.subrecord._crud.relationsRecord
      // extra.subrecord._iam.relationsRecord
      // extra.subblob._crud.relationsRecord
      // extra.subblob._iam.relationsRecord
    }

    // permission overrides and extensions
    permissions: {
      owners: "owner + parent->owners"
      member: "owners + direct_member"

      // need blobs since they can nest now
      R.blob.permissions
      extra.subrecord.permissions
      extra.subblob.permissions
    }
  }
  blob: {
    relations: {
      direct_member: _direct_member
      // this is the (recursive) magic that let's us "nest" nsids
      // do we need something for current record perms vs sub-record?
      parent: "space | bubble"
    }
    permissions: {
      owners: "owner + parent->owners"
      member: "owners + direct_member"
    }
  }
  rpc: {}
}

// extra relations & permission setup w/o making a resource
extra: {
  [n=string]: {
    _crud: #crud & { prefix: n }
    _iam:  #iam  & { prefix: n }
    relations: {
      _crud.relations
      _iam.relations
    }
    permissions: {
      _crud.permissions
      _iam.permissions
    }
  }
  subrecord: {}
  subblob: {}
}

//
// The following massages the input and builds up the schema as a string
//

#definitions: {
  name: string
  relns: [string]: string
  perms: [string]: string
  // build up the resource partial schema
  tmp: {
    r: strings.Join([ for k,v in relns { "relation \(k): \(v)" }], "\n  ")
    p: strings.Join([ for k,v in perms { "permission \(k) = \(v)" }], "\n  ")
  }
  output: """
  definition \(name) {
    // relations
    \(tmp.r)

    // permissions
    \(tmp.p)
  }
  """
}

#relnFormat: {
  subjs: _
  caveats: [...string] | *["nsids"]
  _s: list.FlattenN(subjs,2)
  _c: list.FlattenN([
    for s in _s {[
      s,
      for c in caveats if s != "superuser" { ["\(s) with \(c)"] },
    ]}
  ],2)
  output: strings.Join(_c, " | ")
}

#crud: {

  // consider adding admin to capture query & procedure
  //   they are intentionally separate permission groups to enable certain use-cases
  //   admin (or read_write) would be convenience for giving two broad permissions
  //   we could alternatively expose being able to write multiple relations
  //   during (i.e.) record creation via lexicon & xrpc (more flexible, more onus on devs)
  //   they do come in a variety, so trying to define one among many may be a fool's errand
  //   ... and this is what roles are for anyway
  prefix: string
  relations: {
    for r in ["deleter", "updater"] { "\(prefix)_\(r)": _relnAll },
    for r in ["creator"] { "\(prefix)_\(r)": _relnAllWild },
    for r in ["lister", "reader"] { "\(prefix)_\(r)": _relnAllWildAnon },
  }
  relationsRecord: {
    for r in ["deleter", "updater"] { "\(prefix)_\(r)": _relnRecordAll },
    for r in ["creator"] { "\(prefix)_\(r)": _relnRecordAllWild },
    for r in ["lister", "reader"] { "\(prefix)_\(r)": _relnRecordAllWildAnon },
  }
  relationsRpc: {
    for r in ["caller"] { "\(prefix)_\(r)": _relnAllWild },
  }
  permissions: {
    // modifying
    "\(prefix)_delete": strings.Join(["owners", "\(prefix)_deleter", "parent->\(prefix)_delete"], " + "),
    "\(prefix)_update": strings.Join(["\(prefix)_delete", "\(prefix)_updater", "parent->\(prefix)_update"], " + "),
    "\(prefix)_create": strings.Join(["\(prefix)_update", "\(prefix)_creator", "parent->\(prefix)_create"], " + "),

    // viewing
    "\(prefix)_list": strings.Join(["owners", "\(prefix)_lister", "parent->\(prefix)_list"], " + "),
    "\(prefix)_read": strings.Join(["\(prefix)_list", "\(prefix)_reader", "parent->\(prefix)_read"], " + "),
  }
  permissionsParentless: {
    // modifying
    "\(prefix)_delete": strings.Join(["owners", "\(prefix)_deleter"], " + "),
    "\(prefix)_update": strings.Join(["\(prefix)_delete", "\(prefix)_updater"], " + "),
    "\(prefix)_create": strings.Join(["\(prefix)_update", "\(prefix)_creator"], " + "),

    // viewing
    "\(prefix)_list": strings.Join(["owners", "\(prefix)_lister"], " + "),
    "\(prefix)_read": strings.Join(["\(prefix)_list", "\(prefix)_reader"], " + "),
  }
  permissionsRpc: {
    "rpc_call": "owners + rpc_caller + parent->rpc_call"
  }
  permissionsRpcParentless: {
    "rpc_call": "owners + rpc_caller"
  }

}

#iam: {
  prefix: string
  relations: {
    for r in ["adminer", "editor", "lister", "reader"] { "\(prefix)_iam_\(r)": _relnAll },
  }
  relationsRecord: {
    for r in ["adminer", "editor", "lister", "reader"] { "\(prefix)_iam_\(r)": _relnRecordAll },
  }
  permissions: {
    // modifying
    "\(prefix)_iam_admin": strings.Join(["owners", "\(prefix)_iam_adminer", "parent->\(prefix)_iam_admin"], " + "),
    "\(prefix)_iam_edit": strings.Join(["\(prefix)_iam_adminer", "\(prefix)_iam_editor", "parent->\(prefix)_iam_edit"], " + "),

    // viewing
    "\(prefix)_iam_list": strings.Join(["owners", "\(prefix)_iam_lister", "parent->\(prefix)_iam_list"], " + "),
    "\(prefix)_iam_read": strings.Join(["\(prefix)_iam_list", "\(prefix)_iam_reader", "parent->\(prefix)_iam_read"], " + "),
  }
  permissionsParentless: {
    // modifying
    "\(prefix)_iam_admin": strings.Join(["owners", "\(prefix)_iam_adminer"], " + "),
    "\(prefix)_iam_edit": strings.Join(["\(prefix)_iam_adminer", "\(prefix)_iam_editor"], " + "),

    // viewing
    "\(prefix)_iam_list": strings.Join(["owners", "\(prefix)_iam_lister"], " + "),
    "\(prefix)_iam_read": strings.Join(["\(prefix)_iam_list", "\(prefix)_iam_reader"], " + "),
  }
}
