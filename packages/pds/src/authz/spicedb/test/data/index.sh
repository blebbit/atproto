#!/usr/bin/env bash
set -euo pipefail

DATA_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"

source $DATA_DIR/roles.sh
source $DATA_DIR/accounts.sh
