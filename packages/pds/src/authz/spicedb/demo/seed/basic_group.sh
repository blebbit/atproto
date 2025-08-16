#!/usr/bin/env bash
set -euo pipefail

seed_basic_group () {

  #
  # Jay
  #
  eval ${accounts[jay]}
  group=${acct[gs]}
  space=${acct[sr]}
  subj=$group#member

  mrun "jay adds a standalone group" bind $group parent $space
  for reln in ${lister_role[@]}; do
    mrun "..reln:" bind $space $reln $subj
  done
  for reln in ${iam_lister_role[@]}; do
    mrun "..reln:" bind $space $reln $subj
  done
  mrun "jay adds devin to the standalone group" bind $group direct_member acct:devin


  #
  # Paul
  #
  eval ${accounts[paul]}
  group=${acct[gh]}
  space=${acct[sr]}
  subj=$group#member

  # homies group in root, mainly read only, add accts
  mrun "paul creates a homies group" bind $group parent $space
  for reln in ${lister_role[@]}; do
    mrun "..reln:" bind $space $reln $subj
  done
  mrun "paul adds bryan" bind $group direct_member acct:bryan
  mrun "paul adds devin" bind $group direct_member acct:devin
  # make it so homies can create bsky posts
  mrun "allow paul's homies to make bsky posts" bind $space record_creator $subj --caveat 'nsid_allowed:{"allowed_nsid":["bsky_post"]}'

  # devs group in atproto,tbd permissions, add accts
  group=${acct[gd]}
  space=${acct[sn]}
  subj=$group#member
  mrun "paul creates a devs group" bind $group parent $space
  for reln in ${admin_role[@]}; do
    mrun "..reln:" bind $space $reln $subj
  done
  mrun "paul adds bryan" bind $group direct_member acct:bryan
  run bind $group group_iam_adminer acct:bryan
  mrun "paul adds devin" bind $group direct_member acct:devin
  run bind $group group_iam_adminer acct:devin


  #
  # Bryan
  #


  #
  # Devin
  #


  #
  # Alice
  #


  #
  # Darth
  #


}
