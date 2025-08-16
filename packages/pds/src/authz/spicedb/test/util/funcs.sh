#!/usr/bin/env bash
set -euo pipefail

ZED="zed --endpoint localhost:50051 --token spicedb --insecure --log-format=console"

# touch  '<resource:id>'  '<relation>'   '<subject:id#relation?>'
# delete '<resource:id>'  '<relation>'   '<subject:id#relation?>'
# read   '<resource:id?>' '<relation?>'  '<subject?:id?#relation?>'
# nuke   '<resource:id?>' '<relation?>'  '<subject?:id?#relation?>'
# check  '<resource:id>'  '<permission>' '<subject:id>'
# lookr  '<resource>'     '<permission>' '<subject:id>'
# looks  '<resource:id>'  '<permission>' '<subject:id>'
# expand '<permission>'   '<resource:id>'

# Define the base command and its flags as an array
ZED_CMD=(
    "zed"
    "--endpoint" "localhost:50051"
    "--token" "spicedb"
    "--insecure"
    "--log-format=console"
)

# Define the 'touch' command by adding to the base array
touchc=("${ZED_CMD[@]}" "relationship" "touch")

# --- Your helper functions ---

run() {
  set +e
  "$@" | grep -v -e '^Last cursor:.*' -e '^Gg.*$'
  set -e
}
mrun() {
  msg=$1
  shift
  # Use printf for safer argument printing
  printf "%s " "$msg" "($@)"
  echo "" # for newline
  set +e
  "$@" | grep -v -e '^Last cursor:.*' -e '^Gg.*$'
  set -e
}
mrunn() {
  mrun "$@"
  echo
}

touch() {
  # Execute the command array, passing arguments safely
  "${touchc[@]}" "$@"
}
touchv() {
  # Echo the command for debugging
  echo "${touchc[@]}" "$@"
  # Execute the command array, passing arguments safely
  "${touchc[@]}" "$@"
}

# run() {
#   set +e
#   $@ | grep -v -e '^Last cursor:.*' -e '^Gg.*$'
#   set -e
# }
# mrun() {
#   msg=$1
#   shift
#   echo $msg "($@)"
#   set +e
#   $@ | grep -v -e '^Last cursor:.*' -e '^Gg.*$'
#   set -e
# }
# mrunn() {
#   mrun "$@"
#   echo
# }

# touchc="$ZED relationship touch"
# touch() {
#   $touchc $@
# }
# touchv() {
#   echo "$touchc $@"
#   $touchc $@
# }

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
checke() {
  E=$1
  shift 1
  R=`$checkc $@`
  if [[ $R != $E ]]; then
    echo "ERROR: $R is not $E"
    mrun "rerunning with explain" $checkc $@ --explain
    exit 1
  fi
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
