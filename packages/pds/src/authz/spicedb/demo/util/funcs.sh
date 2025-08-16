#!/usr/bin/env bash
set -euo pipefail

ZED="zed --endpoint localhost:50051 --token spicedb --insecure --log-format=console"

# bind   '<resource:id>'  '<relation>'   '<subject:id#relation?>'
# delete '<resource:id>'  '<relation>'   '<subject:id#relation?>'
# read   '<resource:id?>' '<relation?>'  '<subject?:id?#relation?>'
# nuke   '<resource:id?>' '<relation?>'  '<subject?:id?#relation?>'
# check  '<resource:id>'  '<permission>' '<subject:id>'
# lookr  '<resource>'     '<permission>' '<subject:id>'
# looks  '<resource:id>'  '<permission>' '<subject:id>'
# expand '<permission>'   '<resource:id>'

run() {
  set +e
  $@ | grep -v -e '^Last cursor:.*' -e '^Gg.*=$'
  set -e
}
mrun() {
  msg=$1
  shift
  echo $msg "($@)"
  run $@
}
mrunn() {
  mrun "$@"
  echo
}

bindc="$ZED relationship touch"
bind() {
  $bindc $@
}
bindv() {
  echo "$bindc $@"
  $bindc $@
}

deletec="$ZED relationship delete"
delete() {
  $deletec $@
}
deletev() {
  echo "$deletec $@"
  $deletec $@
}

readc="$ZED relationship read --consistency-full"
read() {
  $readc $@
}
readv() {
  echo "$readc $@"
  $readc $@
}

nukec="$ZED relationship bulk-delete"
nuke() {
  $nukec $@
}
nukev() {
  echo "$nukec $@"
  $nukec $@
}

checkc="$ZED permission check --consistency-full"
check() {
  $checkc $@
}
checkv() {
  echo "$checkc $@"
  $checkc $@
}

# <resource> <permission> <subject:id>
lookrc="$ZED permission lookup-resources --consistency-full"
lookr() {
  $lookrc $@
}
lookrv() {
  echo "$lookrc $@"
  $lookrc $@
}

# <resource:id> <permission> <subject:id>
looksc="$ZED permission lookup-subjects --consistency-full"
looks() {
  $looksc $@
}
looksv() {
  echo "$looksc $@"
  $looksc $@
}

expandc="$ZED permission expand"
expand() {
  $expandc $@
}
expandv() {
  echo "$expandc $@"
  $expandc $@
}

apply_role() {
  rsrc=$1
  reln=$2
  subj=$3
  for reln in ${role[@]}; do
    bind $rsrc $reln $subj
  done
}
