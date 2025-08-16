#!/usr/bin/env bash
set -euo pipefail

seed_basic_role () {

  #
  # Jay
  #
  eval ${accounts[jay]}
  group=${acct[ga]}
  space=${acct[sr]}
  role=${acct[ra]}
  subj=$role#member

  mrun "jay adds an admin role" bind $role parent $space
  for reln in ${role[@]}; do
    mrun "..reln:" bind $space $reln $subj
  done

  # jay creates an fans role and sets up permissions
  # tbd...

  # jay creates an admin group, assigns the admin role, and adds paul
  mrun "jay adds an admin group" bind $group parent $space
  mrun "jay gives admin group the admin role" bind $role direct_member $group#member # add group to role
  mrun "jay adds paul to a group" bind $group direct_member acct:paul

  # some checks
  # check $jsr group_create acct:paul # can paul create a group in jay's space? (expect: true)

}
