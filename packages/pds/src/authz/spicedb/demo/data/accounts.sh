#!/usr/bin/env bash
set -euo pipefail

# top-level map
declare -A accounts

# jay's stuff
unset acct; declare -A acct
acct[sr]=space:jay/root
acct[sn]=space:jay/bsky
acct[ra]=role:jay/root/at_role/admins
acct[ga]=group:jay/root/at_group/admins
acct[gs]=group:jay/root/at_group/standalone
accounts[jay]=$(declare -p acct)

# paul's stuff
unset acct; declare -A acct
acct[sr]=space:paul/root
acct[sn]=space:paul/atproto
acct[gh]=group:paul/root/at_group/homies
acct[gd]=group:paul/atproto/at_group/devs
accounts[paul]=$(declare -p acct)

# bryan's stuff
unset acct; declare -A acct
acct[sr]=space:bryan/root
acct[sn]=space:bryan/atproto
acct[gt]=group:bryan/atproto/at_group/team
accounts[bryan]=$(declare -p acct)

# devin's stuff
unset acct; declare -A acct
acct[sr]=space:devin/root
accounts[devin]=$(declare -p acct)

# alice's stuff
unset acct; declare -A acct
acct[sr]=space:alice/root
accounts[alice]=$(declare -p acct)

# darth's stuff
unset acct; declare -A acct
acct[sr]=space:darth/root
accounts[darth]=$(declare -p acct)
