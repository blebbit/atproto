# SpiceDB integration

Also look at [the proposal notes at the repo root](/proposal.md) (no pun intended)

### spicedb links

- https://github.com/authzed/spicedb
- https://www.youtube.com/@authzed
- https://authzed.com/docs/spicedb/getting-started/discovering-spicedb
- https://authzed.com/blog/exploring-rebac
- https://authzed.com/blog/build-you-a-google-groups
- https://authzed.com/blog/google-cloud-iam-modeling

Complexities:

- https://authzed.com/blog/the-dual-write-problem
  - https://www.youtube.com/watch?v=6lDkXrFjuhc
- https://authzed.com/docs/spicedb/modeling/recursion-and-max-depth


### at-uri & content addressing

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


## schema

`./schema` has the Spicedb schema
- `atproto.zed` is the root
- `_a.zed` is the compiled version
- the reset are components

```sh
# generate and apply the schema
make gen
make mig

# reset everything and start fresh
make reset
```

## demo

The `./demo` dir is designed to make it
easy to experiment with the schema
and the many use-cases for atproto.

The `name` of the use-case is `./cases/<name>`.

### seeding

Multiple accounts are setup with various
spaces, groups, roles, and relationship.
These are easy to extend with data.

- users: [jay, paul, bryan, devin, alice, darth]
- seeds: [accts, basic_group, basic_role, basic, default (basic)]


> [!NOTE]
> Seeds are idempotent, run them multiple times without worry.

```sh
# run a seeding helper
make case/_blueprint OPTS="-s accts"
make case/_blueprint OPTS="-s basic_groups"
make case/_blueprint OPTS="-s default"

# clear the database
make case/_blueprint OPTS="-x all"
```

Details:

- accts, spaces, groups [./demo/data/accounts.sh](./demo/data/accounts.sh).
- predefined roles [./demo/data/roles.sh](./demo/data/roles.sh).
- seeding helpers [./demo/seed](./demo/seed)


## example use-cases

### Working with a use case:

```sh
# run a use-case
make case/_blueprint

# wipe & seed
make case/_blueprint OPTS="-x all -s default"

# run a sub-case
make case/_blueprint OPTS="-c jay"
make case/_blueprint OPTS="-c paul"

# start fresh
make reset
```

### Use-Case List

- [_blueprint](./demo/cases/_blueprint.sh) - basic demo and blueprint for new cases
- [appview_prefs](./demo/cases/appview_prefs.sh) - service-space ownership



## adding a use-case

Copy `_blueprint.sh` to a file with the name you want, then go to town!

### workflow

```sh

# copy to start
cp demo/case/_blueprint.sh demo/case/my_case.sh

# edit file...

# run a use-case
make case/my_case

# wipe & seed
make case/my_case OPTS="-x all -s default"

# run a sub-case
make case/my_case OPTS="-c foo"
make case/my_case OPTS="-c bar"

# start fresh
make reset

```

### helper functions

Look in the seeds and cases for examples

_note, all values should be spicedb formatted_

```sh

# spicedb
bind   '<resource:id>'  '<relation>'   '<subject:id#relation?>'
delete '<resource:id>'  '<relation>'   '<subject:id#relation?>'
read   '<resource:id?>' '<relation?>'  '<subject?:id?#relation?>'
nuke   '<resource:id?>' '<relation?>'  '<subject?:id?#relation?>'
check  '<resource:id>'  '<permission>' '<subject:id>'
lookr  '<resource>'     '<permission>' '<subject:id>'
looks  '<resource:id>'  '<permission>' '<subject:id>'
expand '<permission>'   '<resource:id>'

# wrappers
apply_role '<resource:id>' '<role>' '<subject:id#relation?>'
run   spicedb...   # run with filter for noisy logs
mrun  spicedb...   # print run the operation
mrunn spicedb...   # same as last, extra newline

```

### releation patterns

```sh

# create a space on the root or nested
bind space:did/my-space parent space:did/root
bind space:did/blog  parent space:did/my-space

# create a group and add members
bind group:did/root/at_group/my-group parent space:did/my-space
bind group:did/root/at_group/my-group direct_member acct:did
bind group:did/root/at_group/my-group direct_member group:did/space/at_group/my-friendbook

# apply a role (from ./demo/data/roles.sh)
apply_role space/did/my-space lister_role group:did/root/at_group/my-group

# permissioned bsky content (per-app spaces)
bind space:did/bsky parent space:did/root    # create a separate bsky space
bind space:did/bsky owner  service:bsky_app  # let Bluesky be an owner on the space

# let all logged in users view things and create posts/likes
bind space:did/bsky record_lister  'acct:*' \
bind space:did/bsky record_creator 'acct:*' \
      --caveat 'nsid_allowed:{"allowed_nsid":["bsky_post","bsky_like"]}'

# let only friends repost things
bind space:did/bsky record_creator  group:did/root/at_group/my-friendbook \
      --caveat 'nsid_allowed:{"allowed_nsid":["bsky_repost"]}'

# give a service like labeler or feedgen access
bind space:did/bsky moderation_admin service:custom-labeler
bind space:did/bsky record_lister    service:graze-feedgen

```

### permission checks

```sh

# check a permission
check space:did/root create_record acct:did
check space:did/root create_record acct:did --caveat-context '{"nsid":"bsky_repost"}'
check space:did/root read_record   acct:did --caveat-context '{"nsid":"bsky_post"}'

# lookup members of a group
looks group:did/root/at_group/my-group member acct
looks group:did/root/at_group/my-group member group#member

# read all group relations
read group:did/space

```
