package schema

import (
	"list"
	"strings"
)

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
  // record
  // nsid
]

_relns: {
	All:         (#relnFormat & {subjs: [["superuser"],                   _subjs, _membs]}).output
	AllWild:     (#relnFormat & {subjs: [["superuser"],           _wilds, _subjs, _membs]}).output
	AllWildAnon: (#relnFormat & {subjs: [["superuser", "anon:*"], _wilds, _subjs, _membs]}).output

	RecordAll:         (#relnFormat & {subjs: [["superuser"],                   _subjs, _membs, ["record#member"]]}).output
	RecordAllWild:     (#relnFormat & {subjs: [["superuser"],           _wilds, _subjs, _membs, ["record#member"]]}).output
	RecordAllWildAnon: (#relnFormat & {subjs: [["superuser", "anon:*"], _wilds, _subjs, _membs, ["record#member"]]}).output

	// without caveats
	// All:         (#relnFormat & {subjs: [["superuser"],                   _subjs, _membs], caveats: []}).output
	// AllWild:     (#relnFormat & {subjs: [["superuser"],           _wilds, _subjs, _membs], caveats: []}).output
	// AllWildAnon: (#relnFormat & {subjs: [["superuser", "anon:*"], _wilds, _subjs, _membs], caveats: []}).output

	// RecordAll:         (#relnFormat & {subjs: [["superuser"],                   _subjs, _membs, ["record#member"]], caveats: []}).output
	// RecordAllWild:     (#relnFormat & {subjs: [["superuser"],           _wilds, _subjs, _membs, ["record#member"]], caveats: []}).output
	// RecordAllWildAnon: (#relnFormat & {subjs: [["superuser", "anon:*"], _wilds, _subjs, _membs, ["record#member"]], caveats: []}).output
}

#relnsJoin: {
	relns: [...]
	out: strings.Join(list.FlattenN(relns, 2), " | ")
}

resources: {
	// template
	[r=string]: {
		_crud: #crud & {prefix: r}
		_iam: #iam & {prefix: r}

		// relations: _relations
		relations: _
		// so we can reference without merged contents
		_relations: {

			// crud relations
			[
				if r == "rpc" {
					_crud.relationsRpc
					_iam.relations
				},
				if r == "record" || r == "blob" {
					_crud.relationsRecord
					_iam.relationsRecord
				},
				{
					_crud.relations
					_iam.relations
				},
			][0]
		}
		_relations: {

			// crud relations
			[
				if r == "rpc" {
					_crud.relationsRpc
					_iam.relations
				},
				if r == "record" || r == "blob" {
					_crud.relationsRecord
					_iam.relationsRecord
				},
				{
					_crud.relations
					_iam.relations
				},
			][0]
		}

		// permissions: _permissions
		permissions: _
		// so we can reference without merged contents
		_permissions: {

			[
				if r == "rpc" {
					_crud.permissionsRpc
					_iam.permissions
				},
				if r == "bubble" {
					_crud.permissionsParentless
					_iam.permissionsParentless
				},
				{
					_crud.permissions
					_iam.permissions
				},
			][0]
		}
		_permissionsParentless: {

			[
				if r == "rpc" {
					_crud.permissionsRpcParentless
					_iam.permissionsParentless
				},
				{
					_crud.permissionsParentless
					_iam.permissionsParentless
				},
			][0]
		}

		// build up the resource partial schema
		gen: #definitions & {
			name:  r
			relns: relations
			perms: permissions
		}
		schema: gen.output
	}

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
		r: strings.Join([for k, v in relns {"relation \(k): \(v)"}], "\n  ")
		p: strings.Join([for k, v in perms {"permission \(k) = \(v)"}], "\n  ")
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
	_s: list.FlattenN(subjs, 2)
	_c: list.FlattenN([
		for s in _s {[
			s,
			for c in caveats if s != "superuser" {["\(s) with \(c)"]},
		]},
	], 2)
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
		// admin
		for r in ["adminer", "deleter", "updater", "editor"] {"\(prefix)_\(r)": _relns.All}
		for r in ["creator"] {"\(prefix)_\(r)": _relns.AllWild}
		// editor
		for r in ["viewer", "lister", "getter"] {"\(prefix)_\(r)": _relns.AllWildAnon}
		// accessor
	}
	// do we still need this? do records have members with the space/record duality?
	relationsRecord: {
		for r in ["adminer", "deleter", "updater", "editor"] {"\(prefix)_\(r)": _relns.RecordAll}
		for r in ["creator"] {"\(prefix)_\(r)": _relns.RecordAllWild}
		for r in ["viewer", "lister", "getter"] {"\(prefix)_\(r)": _relns.RecordAllWildAnon}
	}
	relationsRpc: {
		for r in ["caller"] {"\(prefix)_\(r)": _relns.AllWild}
	}

	// these are generally structured to be independent so that apps have the flexibility to separate each CRUD or grouping
	permissions: {
		// groupings
		"\(prefix)_admin":  strings.Join(["owners",          "\(prefix)_adminer", "parent->\(prefix)_admin"], " + ")
		"\(prefix)_edit":   strings.Join(["\(prefix)_admin", "\(prefix)_editor",  "parent->\(prefix)_edit" ], " + ")
		"\(prefix)_view":   strings.Join(["\(prefix)_admin", "\(prefix)_viewer",  "parent->\(prefix)_view" ], " + ")
		// modifying
		"\(prefix)_delete": strings.Join(["\(prefix)_admin", "\(prefix)_deleter", "parent->\(prefix)_delete"], " + ")
		"\(prefix)_update": strings.Join(["\(prefix)_edit",  "\(prefix)_updater", "parent->\(prefix)_update"], " + ")
		"\(prefix)_create": strings.Join(["\(prefix)_edit",  "\(prefix)_creator", "parent->\(prefix)_create"], " + ")
		// viewing
		"\(prefix)_list":   strings.Join(["\(prefix)_view",  "\(prefix)_lister", "parent->\(prefix)_list"], " + ")
		"\(prefix)_get":    strings.Join(["\(prefix)_view",  "\(prefix)_getter", "parent->\(prefix)_get" ], " + ")
		// access - for getting secret cypher text i.e. like ESO can list/get but cannot access, the usage can get/access but not list
		//        - this would be for accessing internal data, where get might just return metadata (not the record value, so one can check existance and access without seeing the details)
	}

	// same as permissions, but the parent->... is removed
	permissionsParentless: {
		// groupings
		"\(prefix)_admin":  strings.Join(["owners",          "\(prefix)_adminer"], " + ")
		"\(prefix)_edit":   strings.Join(["\(prefix)_admin", "\(prefix)_editor" ], " + ")
		"\(prefix)_view":   strings.Join(["\(prefix)_admin", "\(prefix)_viewer" ], " + ")
		// modifying
		"\(prefix)_delete": strings.Join(["\(prefix)_admin", "\(prefix)_deleter"], " + ")
		"\(prefix)_update": strings.Join(["\(prefix)_edit",  "\(prefix)_updater"], " + ")
		"\(prefix)_create": strings.Join(["\(prefix)_edit",  "\(prefix)_creator"], " + ")
		// viewing
		"\(prefix)_list":   strings.Join(["\(prefix)_view",  "\(prefix)_lister"], " + ")
		"\(prefix)_get":    strings.Join(["\(prefix)_view",  "\(prefix)_getter"], " + ")
		// access - for getting secret cypher text i.e. like ESO can list/get but cannot access, the usage can get/access but not list
		//        - this would be for accessing internal data, where get might just return metadata (not the record value, so one can check existance and access without seeing the details)
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

	// need all the same nouns/verbs as crud, good for consistency too
	_rs: ["adminer", "editor", "deleter", "updater", "creator", "viewer", "lister", "getter"]
	relations: {
		for r in _rs {"\(prefix)_iam_\(r)": _relns.All}
	}
	relationsRecord: {
		for r in _rs {"\(prefix)_iam_\(r)": _relns.RecordAll}
	}
	_crud: #crud & { "prefix": "\(prefix)_iam" }
	permissions: _crud.permissions
	permissionsParentless: _crud.permissionsParentless
}
