#!/usr/bin/env bash
set -euo pipefail

CASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
source $CASE_DIR/../_common.sh
source $DEMO_DIR/seed/index.sh

echo "BLUEPRINT: $@"

CASE=${1:-default}
# shift $((OPTIND - 1))

case $CASE in
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
