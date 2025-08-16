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


