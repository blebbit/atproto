#!/bin/bash
set -euo pipefail

ACCT=
CALL () {
  echo "$@"
  pnpm run --silent hack $ACCT "$@"
}

ACCT="--account=alice"

# quick debug session
# CALL space.describeSpace alice.test
# exit

# create spaces for alice
CALL space.createSpace alice.test '{ "displayName": "ATSpace" }' '{ "rkey": "at-space" }'
CALL space.createSpace alice.test '{ "displayName": "MySpace" }' '{ "space": "at-space" }'
CALL space.createSpace alice.test '{ "displayName": "Blog" }' '{ "rkey": "blog" }'

# create groups for alice
CALL space.createGroup alice.test '{ "displayName": "Admins" }' '{ "rkey": "admins" }'
CALL space.createGroup alice.test '{ "displayName": "Moderators" }' '{ "rkey": "moderators" }'
CALL space.createGroup alice.test '{ "displayName": "atdev" }' '{ "rkey": "atdev", "space": "at-space" }'

# print repo information
CALL space.describeSpace alice.test
