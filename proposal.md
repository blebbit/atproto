# Proposal: Permissioned Data in the PDS

The general idea is to have a separate set of "spaces" in the PDS

- permissions and groups like google docs / iam
- hold any records / blobs
- can be nested like folders in google docs / cloud
- separate lexicon and code flows

This is not a proposal for E2EE data or messaging.
That will be implemented separately.
The goal here is to unlock a number of app modalities
that need private content they can access to build their experience.

we should not break any apps using public repo data
(though may need to update packages to support updated at:// scheme)

[Discussion on ATProtocol Community Discourse](https://discourse.atprotocol.community/t/blebbit-use-cases/51/7)

## Status

- [x] Permission Schema
- [x] Lexicon docs
- [ ] Endpoint implementation
- [ ] Auth options, especially for pds-to-pds proxying
- [ ] Signatures for verifying authorship
- [ ] Changes to account management UI
- [ ] Proposal

## The framing comment by @bnewbold from Bluesky

### from https://github.com/bluesky-social/atproto/discussions/3363

To hint at the direction we are thinking for folding this in to the protocol proper:

- a concept similar to repos called something like "namespace" would be introduced. namespaces are sets of records identified by collection and record key, stored in the user's PDS
- the public repo is basically a special namespace which is always public, and has data stored in an MST, via "commits", and with changes going out publicly on the firehose
- the other namespaces don't have MSTs, don't have overall commits, and don't go out publicly on a firehose. they are just stored in a boring database, and request authentication+authorization to access. they would probably have a different set of APIs to get/create/update/delete. they might involve CBOR serialization (so they can have CID versions), or might not. records would use the same Lexicon schema system.
- access is gated to the user's client (via auth scopes); and to other users (by DID); and to other services (also by DID). there would be at least collection-level gating, and possibly record-level. there are also meta-controls over the ability to list which namespaces of which kind exist for a given user
- there would be a special "personal" namespace for each user, which is for things like preferences and mutes. these might give access to services, but not to other users
- other namespaces probably have an overall "type", and then an "instance". these are kind of like another layer of collection (NSID) and record-key, but for the overall namespace. access to create and enumerate entire namespaces would be granted by "type" to clients. as an example, a type could be "private-travel-photos", and an instance could be "my family trip to the beach". that namespace could contain multiple records of multiple types inside it. blobs are probably associated with a namespace.
- you don't move data between public repos and namespaces. content is either public or not. you don't toggle an account between "public" and "private". it is technically possible to have the same data types in both public and private storage, but you don't necessarily mix public and private content together in API views or client UI
- this should scale to ACLs with 10s of millions of accounts. PDS resource consumption scales with group sizes; this is different from how public repos scale
- in this vision of private data, nothing is encrypted at rest or E2EE, only in transit (eg, TLS). PDS has full visibility in to the data and ACLs. E2EE group DMs would be an entirely separate mechanism
- complexity comes in around how to make it efficient to synchronize updates between many users and services; especially allowing multiple client/user-agent implementations.
- TBD if this uses a variant of the at:// URI scheme, or some new URI scheme

We aren't fully committed to that overall architecture, but that is the general idea of what we are thinking.

## Use Cases

- google docs like control over content
- content creators / paid subscribers
- AppView config / preferences
- Being able to unsubscribe from a mailing list (app stores record about in user PDS, needs long-term permission in case user clicks link in an email to unsubscribe, oauth not built for this)
- groups or communities (_note, "groups" here is different from the concept of space groups_)
- PDS operators, with a permission store available, could oauth / permissions to the admin ui
- AppViews should be able to provide rich permissions over their content w/o needing to implement them

## Questions

- can/should we give apps permission to see a group without seeing its members? Is it easier to just say if they can see a group, they can see the members and their roles? (probably be needed for their UX)
  - what if it is a choice the user can make?


## Challenges

- Dual Write problem
- Distribution / notifications
- Caching authorization (should to some amount, i.e. app has admin role on a space where it stores config/preferences)
- acct vs app permissions
  - two distinct things here
  - PDS handles account / spaces with good default schema, roles, permissions
  - spec / lexicon provide building blocks for apps
  - apps handle their own, much like queries and procedures
    - many apps may be able to get by with space defaults
- what's shared with me? (how do we know when content is spread across pds & repo)


## Things that need to change

- new `com.atproto.space.*` lexicons
  - copy & edit most lexicons from `com.atproto.repo.*`
  - space & groups
  - roles & permissions schema (apps define instances of)
- use `at:/...?space=<space>`
- spec
  - `auth` field on query and procedure lexicon
    - specify the required permission needed to use
    - `com.atproto.space.*` will need some defined too
      - provided set of permissions for working with permissions
  - str format for space?
    - ideally want hard to guess for privacy
    - human readable ok too (i.e. self or my-app-config)
    - so basically the same rules as rkeys
- pds changes
  - account-store
  - xprc handlers
  - spicedb integration (should support interface for other implementations)
  - ui to support space, group, permission management outside of any app
- commits for spaces
  - not from MST, but want some concurrency control

### Lexicon

(descriptions still need to be worked on)

#### Copy & Edit `com.atproto.repo.*`

_Mostly NSID changes_

Probably need to pull in some sync endpoints.
- or do we modify existing ones? (spaces are generally separate)
- need to handle permissions, like sync-v1.1

How about `update` instead of `put`,
aligns with the naming in many more places.

#### Core lexicon

Have records:

- space / bubble
- group
- role
- relation
- record
- blob

Extra xrpc

- permissions check / query
- trigger reconciliation
- capability based token management

##### Record lexicons:

(add field for space)

- [x] record
- [ ] deleteRecord
- [ ] createRecord
- [ ] putRecord
- [ ] listRecords
- [ ] getRecord

##### Other Lexicons:

- [x] defs
- [?] applyWrites
- [ ] describeRepo - returns array of spaces and their collections

##### Blobs

- [ ] uploadBlob
- [ ] listBlobs
- [ ] getBlob
- [ ] (sync) listMissingBlobs

(no delete, garbage collection)

#### Space & Group

*these are similar and orthogonal*

##### Space:

- [x] space (record, ~profile)
- [ ] deleteSpace
- [ ] putSpace
- [x] createSpace
- [ ] listSpaces
- [ ] getSpace
- [ ] describeSpace - returns array of collections in the space `{ user X app }` has access to

##### Group:

- [ ] group (record, ~profile)
- [ ] deleteGroup
- [ ] putGroup
- [ ] createGroup
- [ ] listGroups
- [ ] getGroup
- [ ] describeGroup - returns something based on access...

#### Roles & Permissions

_Largely taken from SpiceDB_

##### Relations:

- [x] relationship (record, redundency)
- [ ] deleteRelationship
- [ ] putRelationship
- [ ] createRelationship
- [ ] getRelationship

(list omitted because of queries)

##### Queries:

- [ ] checkPermission
- [ ] checkBulkPermissions
- [ ] lookupResources
- [ ] lookupSubjects

##### Schema:

Managed by the PDS or App
 - PDS is predefined in atproto
 - APPs can do wtf they like

If we distribute the definition to the records (resources)
then we need to assemble them somehow.
May be easier (at least for POC) to use a "self" record on the
NSID domain authority repo / dns to define the SpiceDB schema.
Permissions are harder to specify because of set & logical rules.

(not full CRUD, deleting would amount to abandoning a NSID authority/domain/app?)

Roles TBD, but really part of the schema that defines a collection or app (`app.blebbit.*`, all collections under an NSID authority)


### AT-URIs

https://www.w3.org/TR/did-1.0

- "space=..." should probably go into the did query section
  - makes things easier, much does not have to change
  - hash is already used with services and in the did doc

### PDS changes

- [./packages/pds/src/actor-store/space](./packages/pds/src/actor-store/space)
- [./packages/pds/src/api/com/atproto/space](./packages/pds/src/api/com/atproto/space)
- helper code for auth & spicedb [./packages/pds/src/auth]
- some other

Related: [What does a PDS implementation entail?](https://github.com/bluesky-social/atproto/discussions/2350)

### Specifying relations and permissions

Defined by [The ATProto SpiceDB Schema](./packages/pds/src/authz/spicedb/schema/atproto.zed)

The key limitation is from [object id format](https://buf.build/authzed/api/docs/main:authzed.api.v1#authzed.api.v1.ObjectReference)

```
	string object_id = 2 [
		(validate.rules) = {
			string: {
				max_bytes: 1024,
				pattern: "^(([a-zA-Z0-9/_|\\-=+]{1,})|\\*)$"
			}
		},
		(buf.validate.field).string.max_bytes = 1024,
		(buf.validate.field).string.pattern = ^(([a-zA-Z0-9/_|\\-=+]{1,})|\\*)$
	];
```

Notably the `:` in DIDs and `.` in NSID need to be transformed.
There is also the limits of at-uris, which are bigger,
but may not be an issue if we use the rkey.

The `rkey` may need to be something better than TID(?),
`cuid` can by cryptographically random, better for security.
TIDs are probably easier to guess or enumerate (?)
Users can also set rkeys to anything, does this create an issue?
Do we need to restrict rkeys more for spaces & permissions?

Permission names and the prefixes below are defined in
[The ATProto SpiceDB Schema](./packages/pds/src/authz/spicedb/schema/atproto.zed)

Subjects:

- `user:<did>`
- `apikey:<...?>`
- `svcacct:<...?>`
- `service:<...?>` (appview, labeler, feedgen, etc...)
- can we also gen Capability Based Authz tokens, and then handle the delegated requests? They could be precomputed with the ZedToken attached for comparison if
data / relations change between issuance and usage
- these should be separate so we can audit what method was used
- possible the same for oauth vs password vs app-pass (replaced with apikey)

Resources:

- `group:<did>/[<space-rkey>]/<group-rkey>` (space optional here, available to all spaces, still needs to be assigned case-by-case)
- `space:<did>/<space-rkey>` (without rkey, applies to all spaces, atypical)
- `nsid:<did>/<space-rkey>/<nsid>` (not really something created in the database, but we probably want to in the permission system(?), but limits actors and records they can operate on)
- `record:<did>/<space-rkey>/<nsid>/<record-rkey>`

rkey:

— the allowed characters are alphanumeric (A-Za-z0-9), period, dash, underscore, colon, or tilde (.-_:~)
- must have at least 1 and at most 512 characters

general transforms (that work for any at-uri as a whole?)

- `: -> |`
- `. -> +`
- `~ -> =`

Sizes:

- did: ...? generally unlimited, initial hard limit of 2048 characters...
  - did:plc:... is probably fine
  - did:web:... is where there are unknowns
  - might be best to have a local map from did->cuid, see below
- nsid: max 317 chars \ _ 840 ... 1024 - 840 = 184
- rkey: max 523 chars /

There is some appeal to locally mapping everything to cuids within an instance
- we store the records anyway, backup / migrate can be based on these
- we can make a column in the database so no extra for records
- just need an extra did->cuid per PDS / instance, can be shared across repos on same PDS / instance

## Proof-of-Concept(s)

Use SpiceDB:

- use spicedb, enumerate reasons, pros, cons...
  - ready-to-use
  - scales well
  - aligns well with PDS and apps
  - supports many databases, but not sqlite
  - supports ACL, RBAC, conditions
  - supports apikeys, service accounts, and more
  - at-uris should work for subjects & resources
    - size limit alignment (relatively large, 2k/512)
    - spacedb uses `:` already, so dids...
    - (with minimal string replace `/:/|/`, both directions)

Docs:

- proposal
- docs
- how-to design permissions, associate with NSID

Example Apps (tbd):

- Authr Example
- Blebbit

## Notes while working on this

- When you add a record to a space, it goes into the repo/pds of the space owner. This means your replies would live in other people's repos/PDS
- we'll need resources in the atproto schema down to collection so we can give permissions to apps to a subset of collections in a space
- many choices about the permissions over the account level spaces/groups/... & relations/permissions/resources need to be in the PDS(aptroto) level schema
- How do apps express and enforce permissions when they cannot fit into the atproto schema?

Today, with follows, if you want to backfill that two-way network (without going to bluesky), you have to crawl the network to find the handles who follow a specific account to get the followers.

After, with permissioned spaces and membership, another two-way network, you have to crawl the network to get the list of all spaces an account has joined, because those records, like all records in a space, are stored in the the spaces repo and PDS.

[OAuth Permission Sets](https://github.com/bluesky-social/proposals/blob/main/0011-auth-scopes/README.md#permission-sets)
are close in shape to roles



Today, with follows, if you want to backfill that two-way network (without going to bluesky), you have to crawl the network to find the handles who follow a specific account to get the followers.

After, with permissioned spaces and membership, another two-way network, you have to crawl the network to get the list of all spaces an account has joined, because those records, like all records in a space, are stored in the the spaces repo and PDS.



Today, with follows, if you want to backfill that two-way network (without going to bluesky), you have to crawl the network to find the handles who follow a specific account to get the followers.

After, with permissioned spaces and membership, another two-way network, you have to crawl the network to get the list of all spaces an account has joined, because those records, like all records in a space, are stored in the the spaces repo and PDS.


### From https://bsky.app/profile/immber.bsky.social/post/3lwphdqi5pc25


I've also thought about what an inbox might be. Something like a webhook is also interesting. Could be based on the public key of the app and the app having write permissions on records they create.

There's a concept of a space for a user like "self"

Apps could similarly be given a "self" space in a user's PDS

Auth could be handled a bit differently, maybe more like pub/priv key, so the app can use the same across all PDSes while also being able to rotate it?

do you have thoughts on this?

With a flow something like

1. User first-time OAuths with an app
2. app stores a public key in their space
3. app can admin that space with the key
4. app can rotate that key
5. user can nuke app access and/or space through the PDS ui

### Commits

- no MST, so no commits...
- we probably want some similar concept to record/repo commits, so we can have some control over concurrent changes from various apps
 - could have a table with some identifier that gets updated in transactions, but per record...? maybe that needs to become a column on the record
