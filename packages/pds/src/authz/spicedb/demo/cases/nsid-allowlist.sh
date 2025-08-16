#!/usr/bin/env bash
set -euo pipefail

DEMO_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
source $DEMO_DIR/_common.sh
source $DEMO_DIR/seed/index.sh

# wipe & seed the database
nuke_all_relns
seed_accounts
seed_basic_group

# work with paul's data
eval ${accounts[paul]}
group=${acct[gh]}
space=${acct[sr]}
subj=$group#member

# check status beforehand
mrunn "can we still write?  in $space?"  looks $space record_create acct
mrunn "can we still skeet?  in $space?"  looks $space record_create acct --caveat-context '{"nsid":"bsky_post"}'
mrunn "can we still like?   in $space?"  looks $space record_create acct --caveat-context '{"nsid":"bsky_like"}'

# incorrectly (replace) caveat to group
mrun "allow paul's homies to make bsky posts" bind $space record_creator $subj --caveat 'nsid_allowed:{"allowed_nsid":["bsky_like"]}'

# check that both are allowed
mrunn "can we still write?  in $space?"  looks $space record_create acct
mrunn "can we still skeet?  in $space?"  looks $space record_create acct --caveat-context '{"nsid":"bsky_post"}'
mrunn "can we still like?   in $space?"  looks $space record_create acct --caveat-context '{"nsid":"bsky_like"}'

# correctly ad second caveat to group
mrun "allow paul's homies to make bsky posts" bind $space record_creator $subj --caveat 'nsid_allowed:{"allowed_nsid":["bsky_post","bsky_like"]}'

# check that both are allowed
mrunn "can we still write?  in $space?"  looks $space record_create acct
mrunn "can we still skeet?  in $space?"  looks $space record_create acct --caveat-context '{"nsid":"bsky_post"}'
mrunn "can we still like?   in $space?"  looks $space record_create acct --caveat-context '{"nsid":"bsky_like"}'
