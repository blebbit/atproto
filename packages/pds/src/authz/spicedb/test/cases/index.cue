package cases

import (
  b "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/cases/blebbit"
)

// apply flags as input to all cases
case: [string]: {
  input: {
    seed: flags.seed
    subcase: flags.subcase
  }
}

// cases from dedicated subdirectories
case: blebbit: b.case

// other cases are in peer files
