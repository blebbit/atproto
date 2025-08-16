package utils

import (
  "list"
  "strings"
)

#case: {
  // inputs
  input: {
    seed:    string
    subcase: string
  }

  // named sets
  relns: [string]: [...(#msgReln|#msgRelns)]
  checks: [string]: [...(#msgCheck|#msgChecks)]
  freeform: [string]: [...#msgFreeform]
  seeds: [string]: [...string]

  // named subcases / scripts
  subcases: [string]: [...string]

  // output
  script: output
  output: strings.Join(list.FlattenN([
    #bashHeader,
    if input.seed    != "" { seeds[input.seed] },
    if input.subcase != "" { subcases[input.subcase] },
  ], 2), "\n")

}
