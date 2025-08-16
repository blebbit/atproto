#!/usr/bin/env bash
set -euo pipefail

# accounts
seed_accounts() {
  for a in ${!accounts[@]}; do
    acct=${accounts[$a]}
    eval $acct
    root=${acct[sr]}
    nest=${acct[sn]:-}

    mrun "rooting $a's space..."    bind $root owner acct:$a
    if [ ! -z $nest ]; then
      mrun "..subspace bubble!"  bind $nest parent $root
    fi
  done
}
