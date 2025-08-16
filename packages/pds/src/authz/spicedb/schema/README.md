# Authzed Schema for ATProto Permissioned Spaces

Files:

- `atproto.cue` - source of truth, other files are code generated
  - CUE to reduce the writing, more compositional, catch errors earlier, I ♥️ CUE
- `atproto.zed` - generated SpiceDB schema that is applied to the database
- `atproto.ts`  - the schema as a string for PDS to run the migration



```sh
# generate the schema and typescript
make gen
```

> [!WARNING]
> You only need to do this if you change the schema.
> The generated version is committed to git.


### Schema outline

These are the resources in the Spicedb schema and some "metadata" about them.
These are the building blocks for apps and most will have associated `com.atproto.space....` records and xrpc for the various permissions. (_note, the current lexicons in git are out of date with this schema, but there is enough there I hope it conveys the idea._).

```
schema/
├── "subjects"
│   ├── acct
│   ├── oauth
│   ├── service
│   ├── svcacct
│   └── apikey
├── "objects"
│   ├── space / bubble
│   │   ├── parent: space | bubble
│   │   ├── owners & members
│   │   ├── have crud/iam for all objects
│   │   └── bubbles break permission walking
│   ├── group
│   │   ├── parent: space | bubble
│   │   ├── owners & members
│   │   └── have crud/iam for self
│   ├── role
│   │   ├── parent: space | bubble
│   │   ├── owners & members
│   │   └── have crud/iam for self
│   ├── nsid?
│   │   ├── parent: space | bubble
│   │   ├── should these nest, or co-nest as nsid/record
│   │   └── have crud/iam for self
│   ├── record
│   │   ├── parent: space | bubble ... | nsid? | record?
│   │   ├── should these nest, or co-nest as nsid/record
│   │   ├── owners & members
│   │   └── have crud/iam for self
│   ├── rpc?
│   │   ├── parent: space | bubble ... | nsid? | record?
│   │   ├── it is an nsid itself
│   │   └── have crud/iam for self
│   └── blob
│       ├── parent: space | bubble
│       ├── owners & members ?
│       └── have crud/iam for self
└── caveats
    ├── tbb mostly...
    ├── allowed nsids
    └── context object match
```


### NSIDs in the Permission System

ATProto NSIDs make designing a reusable permission schema for all apps challenging.
A SpiceDB co-founder told me he does not envy us having this problem.

1. Dynamic in nature
    1. new apps will come into existance
    1. allow / disallow large groups of nsid on a per-app/oauth/space basis
    1. should NSID be a resource in the schema?
        1. did this at first, but they don't have records normally
        1. then moved to caveats, but more work for authz calc
        1. probably will move them back,
1. Apps need to map their NSID and records onto the underlying permission building blocks
    1. Can one of these records hold groups or not? what about permissions or ownership?
        1. discord server vs channel vs thread
        1. docs app with infinitely nesting folders
        1. generally, there are all sorts of permutations, how do they get mapped onto the schema
1. Permission Databases and Engines often want the schema at boot time
    1. Various support for, and tradeoffs over, dynamic conditions
1. mapping `at:// -> spicedb`...
    1. DID up to 2k not workable, but spec says implementations can have own limits, may change in the future
    1. Even so, with nesting records, the parent is no longer a single id (for the space), it is an at-uri. This isn't a problem with the SQL databse, but with Spice it is
    1. Could map to internal id, like CUID, and this is an implementation detail, but it does require an extra lookup. Something like this should not leak into the spec
1. are spaces and records one in the same?
    1. Don't want to create multiple records
    1. Virtual spaces the account creates to box things in
    1. spaces have a record themselves, what lives in that JSON value?
    1. Are there are slightly different semantics around what permissions should be available on a record vs a space (I'm inclined to say yes, records probably shouldn't have nested spaces)
