#!/usr/bin/env bash
set -euo pipefail

CASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null && pwd )"
source $CASE_DIR/../_common.sh
source $DEMO_DIR/seed/index.sh

NUKE=
SEED=
SUBCASE=
while getopts "x:s:c:" opt; do
  case $opt in
    x)
      NUKE=$OPTARG
      # echo "confirming.nuke.$NUKE"
      ;;
    s)
      SEED=$OPTARG
      # echo "confirming.seed.$SEED"
      ;;
    c)
      SUBCASE=$OPTARG
      # echo "confirming.subcase.$SUBCASE"
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
    :)
      echo "Option -$OPTARG requires an argument." >&2
      exit 1
      ;;
  esac
done

# Shift positional parameters to remove processed options
shift $((OPTIND - 1))

# First arg is the case
CASE=${1:?case required}
# echo "confirming.case.$CASE"
shift 1

# Remaining arguments after options
# echo "Remaining arguments: $@"

# Cleanup?
if [ ! -z $NUKE ]; then
  echo "nuking.$NUKE"
  case $NUKE in
    all)
      nuke_all_relns
      ;;
    *)
      mrun "clean $NUKE" nuke $NUKE
      ;;
  esac
fi

# Seed?
if [ ! -z $SEED ]; then
  echo "seeding.$SEED"
  case $SEED in
    basic) seed_basic ;;
    accts) seed_accounts ;;
    basic_group) seed_basic_group ;;
    basic_role) seed_basic_role ;;
    *) echo "uknown '$SEED'"; exit 1;;
  esac
fi

if [ "$SUBCASE" == "null" ]; then
  exit 0
fi

# echo "Running $CASE $SUBCASE $@"
$CASE_DIR/$CASE.sh $SUBCASE $@
