#!/usr/bin/env bash
set -euo pipefail

# Some Enumerations
enum_space () {
  mrunn "list all spaces"   read space owner
  mrunn "list all spaces"   read space parent
}

enum_group () {
  mrunn "list all groups"   read group parent
}

ispace () {
  handle=$1
  space=$2
  eval ${accounts[$handle]}

  mrunn "which accts  can ... create groups in $space?"  looks ${acct[$space]} group_create acct
  mrunn "which groups can ... create groups in $space?"  looks ${acct[$space]} group_create group#member
  mrunn "which roles  can ... create groups in $space?"  looks ${acct[$space]} group_create role#member
}

igroup () {
  handle=$1
  group=$2
  eval ${accounts[$handle]}

  mrunn "which accts  are in ... $group?"  looks ${acct[$group]} member acct
  mrunn "which groups are in ... $group?"  looks ${acct[$group]} member group#member
  mrunn "which relns  are on ... $group?"  read  ${acct[$group]}
}

irecord () {
  handle=$1
  space=$2
  eval ${accounts[$handle]}

  mrunn "which accts can... read records    in $space?"  looks ${acct[$space]} record_read acct
  mrunn "which accts can... create records  in $space?"  looks ${acct[$space]} record_create acct
  mrunn "which accts can... skeet           in $space?"  looks ${acct[$space]} record_create acct --caveat-context '{"nsid":"bsky_post"}'
}
