#!/usr/bin/env bash
set -euo pipefail

admin_role=(
  space_creator
  space_iam_lister
  group_creator
  group_iam_adminer
  role_lister
  role_iam_lister
  record_creator
  blob_creator
  rpc_caller
)

lister_role=(
  space_lister
  group_lister
  role_lister
  record_lister
  blob_lister
  rpc_caller
)

iam_lister_role=(
  space_iam_lister
  group_iam_lister
  role_iam_lister
  record_iam_lister
  blob_iam_lister
  rpc_iam_lister
)
