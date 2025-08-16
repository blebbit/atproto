#!/usr/bin/env bash
set -euo pipefail


OUT=
pnpm_list () {
  OUT=$(pnpm list -r --depth=-1 "@atproto/*")
}

ATP=
atpkg_list () {
  ATP=$(echo "$OUT" | grep -e "^@atproto" | awk '{ print $1; }' | sort | uniq)
}

ATH=
authr_list () {
  ATH=$(echo "$OUT" | grep -e "/User" | awk '{ print $2; }')
}

atpkg_link () {
  # get the atproto package list
  atpkg_list

  # link the atproto packages we actually use
  echo "ATPROTO_DEPS:"
  base=/Users/tony/blebbit/atproto/packages
  for pkg in ${ATP}; do
    echo "$pkg"
    d=${pkg#@atproto/}
    dir=${base}/$d
    if [[ "$d" == "oauth"* ]] || [[ "$d" == "jwk"* ]]; then
      dir=${base}/oauth/${d}
    fi
    echo "  $d -> $dir"

    pushd $dir > /dev/null
    pnpm link --global
    popd > /dev/null
    echo
  done
  echo
  echo
}

authr_link () {
  # get the local packages list
  authr_list

  # link atproto packages for each local package
  for pkg in ${ATH[@]}; do
    if [[ "$pkg" == "/Users/tony/blebbit/authr" ]]; then continue; fi
    echo "$pkg"
    pushd $pkg > /dev/null
    set +e
    O=$(pnpm list "@atproto/*" | grep -e "^@atproto" | awk '{ print $1; }' | sort | uniq)
    set -e
    echo "$O"
    pnpm link $O
    popd > /dev/null
    echo
  done
}

# do the work
pnpm_list
# atpkg_link
authr_link