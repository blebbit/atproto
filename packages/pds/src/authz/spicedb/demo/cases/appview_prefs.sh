#!/usr/bin/env bash
set -euo pipefail

CASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
source $CASE_DIR/../_common.sh
source $DEMO_DIR/seed/index.sh

# ensure we have accounts
echo "0. ensuring accounts"
seed_accounts
echo

# create space and assign service
mrun  "1a. create service space"     bind space:jay/bsky parent space:jay/root
mrunn "1b. give app ownership"       bind space:jay/bsky owner  service:bsky_app
# give all users read access, like public, but enforce logged in
mrunn "1c. logged in users can read" bind space:jay/bsky space_reader 'user:*'

# app creates preferences object
mrun  "2a. check app can write"   check space:jay/bsky record_create service:bsky_app
mrunn "2b. create app prefs"      bind  record:jay/bsky/bsky_prefs/self parent space:jay/bsky

# check the app can read the record directly
mrunn "3a. check app can read"    check record:jay/bsky/bsky_prefs/self record_read service:bsky_app


exit 0

SUBCASE=${1:-default}

case $SUBCASE in
  default)
    enum_space
    enum_group
  ;;

  jay)
    seed_basic_role
    ispace  jay sr
    igroup  jay ga
    irecord jay sr
  ;;

  paul)
    seed_accounts
    seed_basic_group
    ispace  paul sr
    igroup  paul gh
    irecord paul sr
  ;;

  custom)
    echo "running custom subcase $@"
    echo "create your own cases or subcases!"
  ;;

  *)
    echo "uknown case '$@'"
    exit 1
  ;;

esac
