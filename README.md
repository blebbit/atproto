# Blebbit's ATProto (TypeScript) ((Patched))

Welcome friends!

This repository contains Bluesky's atproto implementation of AT Protocol,
with various patches applied to it.
Notably, "permissioned spaces"
see the [proposal.md](./proposal.md) for details.

We primarily produce a docker image that
anyone can run as a drop in replacement.

However in order to interact with the patches,
you also need all the related changes throughout
codebase for your own projects that talk to the PDS.
Two options I have yet to try are
(1) publishing under a different `@org` on npm
(2) required to clone, build, link when using in an app

Right now, these changes are extensions and all other functionality should work.
All of the tests and builds remain passing.

For all other README, security, and license stuff,
see the [Original README](./README.orig.md)


## Dependencies

1. Same as the upstream, see the [Original README](./README.orig.md)
2. [CUE](https://cuelang.org), I couldn't help myself
3. [zed](https://github.com/authzed/zed), the CLI for SpiceDB


## Setup

```sh
# build all the packages
make build

# test all the packages
make test

# (re) startup the dev env & pds, this also seeds a bsky app
make run-dev-env

# simulate network activity, i.e. spaces xrpc for seeded users
./packages/dev-env/sim.sh
```

## Commits

We are using a `./git-stack.ts` script
to implement a poor man's Gerrit.
The intention is to move to Gerrit,
for stacked commits and git-codereview features.

Essentially, this is a list of commits with a name as the comment
and then we use `git commit --fixup` and `git rebase` to add
changes to any of the named commits in a predefined stack.
Gerrit will let us do this while also keeping the history
of each commit in the stack.

The CUE team has a really nice Gerrit-GitHub setup
and good instructions on how this works.

[github.com/cue-lang/cue - CONTRIBUTING.md](https://github.com/cue-lang/cue/blob/master/CONTRIBUTING.md)

### `./git-stack.ts <command>`

```
Usage: git-stack.ts <command>
Commands:
  init                 - Create dummy commits for the stack
  list [--files]       - List the commit stack
  add <commit-name>    - Add staged changes to a commit
  remove <commit-name> <file-path> - Remove a file from a named commit
  diff <commit-name>   - Show changes in a named commit
  rebase               - Rebase stack on origin/main
  push                 - Push stack to a remote branch
```

### The named commit stack

```
$ ./git-stack.ts list
Commit Stack:
- extra (4b0d52f)
- examples (d0b48b9)
- pds (7018636)
- packages (d5fcf16)
- lexicon (13d84d3)
- proposal (b910783)
- agents (4f97b2e)
- prep (bcb7bfa)

Stack Bases:
- (blebbit) (6d7bf4bff) Remove old, never resolved, lexicons from the database (#4162)
- (origin) (6d7bf4bff) Remove old, never resolved, lexicons from the database (#4162)

```

If you want to change the list of commits, there are instructions at the top of the script.


### Typical workflow

```sh
# stage files for commit
git add ...

# add staged changes to a named commit
./git-stack.ts add <name>

# force push to upstream (blebbit/atproto)
./git-stack.ts push

# rebase with bluesky-social/atproto
# WARN, only do this with a clean git workspace
#       merge conflicts are not infrequent
./git-stack.ts rebase
```

### Useful sequences

#### Update Lexicons

```sh
# change json and regenerate code
make codegen
make build

# ... any testing

# add to commit stack
git add lexicons/ packages/{api,bsky,ozone,pds/src/lexicon}
./git-stack.ts add lexicon
```
