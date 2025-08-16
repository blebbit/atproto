#!/usr/bin/env bash
set -euo pipefail

SEED_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

source $SEED_DIR/accounts.sh
source $SEED_DIR/basic_role.sh
source $SEED_DIR/basic_group.sh

seed_basic() {
  seed_accounts
  echo
  seed_basic_role
  echo
  seed_basic_group
  echo
}
