# SpiceDB integration

Also look at [the proposal nohttps://bitbucket.org/ferrumai/eng/branch/feature-di-1448-base-branch-argotes at the repo root](/proposal.md) (no pun intended)

### overview

This directory is detached from the PDS and ATProto in local scope.
This means that it is self-containing and sufficient.
The PDS does import the schema when it runs, but that is it.

Contents:

- `Makefile` - helpful commands for working in this directory
- `schema/` - SpiceDB schema for permissioned spaces on ATProto
- `test/` - Seed data and utilities for crafting use cases and other tests
  - `./data` - account oriented spaces, groups, roles, and content
  - `./seed` - named seeding setups from data and extra relations
  - `./cases` - named tests and scenarios that interleave operations and checks
- `validation/` - SpiceDB validation files, imports from the other two, second check on cases


You will need `cue`, `docker`, and `zed` installed to work on this,
as the tooling uses them under the hood.

- https://cuelang.org/docs/introduction/installation/
- https://authzed.com/docs/spicedb/getting-started/installing-zed
- Docker... look it up if you don't have it already :]

### schema

[./schema](./schema) has the Spicedb schema that defines the permission system.
See the README therein for details. In brief

- `atproto.cue` - reduces the writing, more compositional, catch errors earlier
- `atproto.zed` - generated SpiceDB schema that is applied to the database
- `atproto.ts`  - the schema as a string for PDS to run the migration


## test

The `./test` dir is designed to make it easy to test
and experiment with various schemas and use cases for atproto.


### seeding

Multiple accounts are setup with various
spaces, groups, roles, and relationship.
These are easy to extend with more data.

> [!NOTE]
> Seeds are idempotent, run them multiple times without worry.

```sh
# list available seeds
make seed.list

# run a named seed
make seed/account.jay

# clear the database
make clean

# restart the stack
make reset
```

### use cases

The `cases` directory has cases and subcases.
These are meant to explore various scenarios
and be easy enough for anyone to write,
while still giving access to CUE's expressiveness.

```sh
# list available cases & subcases
make case.list
make case.list/basics.subcases
```

The format is relatively straight forward

```cue
case: basics: #case & {
  // "local" variables
  _alice:   "acct:alice"
  _space:   "space:alice/bsky"
  _group:   "group:alice/bsky/at_group/friends"
  _record:  "record:alice/bsky/bsky_post/hello-world"
  ...

  // relations, each field is a list of ["message", [resource, relation, subject]]
  relns: {
    setup: [
      ["  acct owns root",    [_root, "owner", _alice]],
      ["  create bsky space", [_space, "parent", _root]],
      ["  and nested bubble", [_bubble, "parent", _space]],
      ...
    ]
    phase2: [ ... ]
    special: [ ... ]
  }

  // checks, each field is a list of ["message", expected, [resource, relation, subject]]
  // expected is one of ["true", "false", "caveated"]
  // whitespace is used here to align output for easier reading / validating
  checks: {
    basic: [
      ["  root owners", ["true",  [_root, "owners", _alice]]],
      ["  root member", ["false", [_root, "member", _darth]]],
      ...
    ]
    records: [
      ["  message read",    ["true",  [_message, "record_read",   _btrfy]]],
      ["  message read",    ["false", [_message, "record_read",   _darth]]],
      ...
    ]
  }

  // subcase, a bash script by combining the list of strings for a given field
  //          necessary headers and helpers are injected for you
  //          the following is a sequence of headers and the above
  //          turned into strings with the use of helpers from `util`
  subcases: {
    default: [
      #"echo "basics/default - setup""#,
      (util.#relationTo.touchMany & { input: relns.setup }).output,

      // you can also reuse seeds here

      #"echo "basics/default - basic checks""#,
      (util.#relationTo.checkMany & { input: checks.basic }).output,

      #"echo "basics/default - record checks""#,
      (util.#relationTo.checkMany & { input: checks.records }).output,
    ]
  }
}
```

## Adding a Use Case

Copy any of the existing files and name it what you want, then go to town!

### workflow

```sh

# copy to create
cp test/case/atbox.cue test/case/my-case.cue

# edit file...

# run a use case
make case/my-case

# run a subcase
make case/my-case OPTS="-t subcase=foo"

# start fresh
make reset

```

## at-uri & content addressing

To support spaces, we extend at-uris with a query parameter `at://...?space=<rkey>`.
- the space is the parent, root is the unspecified or implied
- every acct has a `did/root` space, then can nest as many as they like
  - `at://did/com.atproto.space.space/root`
  - `spice://did/space`
- two-way conversion for spicedb allowed chars (not seen in demo)
  - at-uri: `at://did/nsid/rkey?space=<space>`,
  - spicedb: `type:did/space/nsid/rkey`
  - similar content-path specificity [acct->space->collection->record]
  - [converstion function for atproto-spicedb](/packages/pds/src/space/format.ts)
- in `demo` we simplify various identifiers for legiblity


## spicedb links

Some useful links for spicedb.

- https://github.com/authzed/spicedb
- https://www.youtube.com/@authzed
- https://authzed.com/docs/spicedb/getting-started/discovering-spicedb
- https://authzed.com/blog/exploring-rebac
- https://authzed.com/blog/build-you-a-google-groups
- https://authzed.com/blog/google-cloud-iam-modeling

Caveats:

- https://authzed.com/blog/caveats/
- https://authzed.com/blog/top-three-caveat-use-cases
- https://authzed.com/docs/spicedb/concepts/caveats

Complexities:

- https://authzed.com/blog/the-dual-write-problem
  - https://www.youtube.com/watch?v=6lDkXrFjuhc
- https://authzed.com/docs/spicedb/modeling/recursion-and-max-depth

