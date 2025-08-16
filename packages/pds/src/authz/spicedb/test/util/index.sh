#!/usr/bin/env bash
set -euo pipefail

UTIL_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

source $UTIL_DIR/funcs.sh
source $UTIL_DIR/queries.sh

nuke_all_relns () {
  for r in blob rpc record group role space acct oauth service; do
    mrun "clean $r" nuke $r
  done
}
