package schema

import (
	"list"
	"strings"
)

//
// The schema text
//
spicedbSchema: strings.Join(list.FlattenN([
	_caveats,
	[for s, _ in subjects {"definition \(s) {}"}],
	[for r in resources {r.schema}],
], 1), "\n\n")

//
// Caveats for dynamic conditions
//
_caveats: [
  """
  //
  // Caveats (CEL expressions)
  //

  // NSID filtering (think oauth permission sets and check)
  // map  vs list: while specifying is more cumbersome,
  // O(1) vs O(N) runtime performance is compelling
  caveat nsids(allowed map<bool>, default bool, nsid string) {
    (nsid in allowed) ? allowed[nsid] : (default || false)
  }
  """,
	// """
	// // NSID filtering (think oauth permission sets and check)
	// caveat nsids(allowed list<string>, nsid string) {
	//   nsid in allowed
	// }
  // // Object matching (think looking for one tree in another, expected -> provided)
  // caveat context(expected map<any>, provided map<any>) {
  //   expected.isSubtreeOf(provided)
  // }
	// caveat allowlist(allowed list<string>, disallowed list<string>, value string) {
	//   value in allowed && !(value in disallowed)
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
	// magiclink: {}
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
// we could use that as the space "type" (but what if multiple apps... or "types")
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


R=resources: {

  // parent, owner, member
  _common: {
		relations: {
			parent: "space | bubble"
			owner: (#relnsJoin & {relns: [_subjs, ["space#member", "bubble#member", "group#member"]]}).out
			direct_member: (#relnsJoin & {relns: [_subjs, ["space#member", "bubble#member", "group#member"]]}).out
    }
		permissions: {
			owners: "owner + parent->owners"
			member: "owners + direct_member"
    }

  }

  //
  // Nesting constructs
  //

	space: {
    _common

		relations: {
			R.space._relations
			R.bubble._relations
			R.group._relations
			R.role._relations
			R.record._relations
			R.blob._relations
			// R.rpc._relations
		}
		permissions: {
			R.space._permissions
			R.bubble._permissions
			R.group._permissions
			R.role._permissions
			R.record._permissions
			R.blob._permissions
			// R.rpc._permissions
		}
	}

	bubble: {
    _common

		relations: {
			R.space._relations
			R.bubble._relations
			R.group._relations
			R.role._relations
			R.record._relations
			R.blob._relations
			// R.rpc._relations
		}
		permissions: {
			// parentless permission to breack the authz walk
			R.space._permissionsParentless
			R.bubble._permissionsParentless
			R.group._permissionsParentless
			R.role._permissionsParentless
			R.record._permissionsParentless
			R.blob._permissionsParentless
			// R.rpc._permissionsRpcParentless
		}
	}

	//
	// organizing resources for subjects and relations
	//
	group: {
    _common
		relations: {
			R.group._relations
		}
		permissions: {
      R.group._permissions
    }
	}
	role: {
    _common
		relations: {
			R.role._relations
		}
		permissions: {
      R.role._permissions
    }
	}

	//
	// content resources
	//

	record: {
		relations: {
			parent: "space | bubble"
			owner: (#relnsJoin & {relns: [_subjs, ["space#member", "bubble#member", "group#member", "record#member"]]}).out
			direct_member: (#relnsJoin & {relns: [_subjs, ["space#member", "bubble#member", "group#member", "record#member"]]}).out

			R.record._relations
		}
		permissions: {
			owners: "owner + parent->owners"
			member: "owners + direct_member"

      R.record._permissions
    }
	}

  blob: {
		relations: {
			parent: "space | bubble"
			owner: (#relnsJoin & {relns: [_subjs, ["space#member", "bubble#member", "group#member", "record#member"]]}).out
			direct_member: (#relnsJoin & {relns: [_subjs, ["space#member", "bubble#member", "group#member", "record#member"]]}).out

			R.blob._relations
		}
		permissions: {
			owners: "owner + parent->owners"
			member: "owners + direct_member"

      R.blob._permissions
    }

  }

	// can groups fill the role of NSIDs? Do we want to separate these concepts for clarity and reasoning?
	// also mainly an organizing resource for relations and app concepts

	// rpc: {}
}
