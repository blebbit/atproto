package cases

import (
  "list"
  "strings"

  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/seed"
  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/util"
)

#heading: {
  H: string
  O: "\n#\n# \(H)\n#"
}

flags: {
  verbose: int | *0 @tag(verbose,type=int)
  clean: string @tag(clean)
  seed: string @tag(seed)
  subcase: string | *"default" @tag(subcase)
}

#case: {

  verbose: string | *flags.verbose

  relns: [string]: [...util.#msgReln]
  checks: [string]: [...util.#msgCheck]

  seeds: [string]: [...string]
  seeds: {
    default: [seed.seed.account.jay.script]
  }

  subcases: [string]: [...string]

  script: strings.Join(list.FlattenN([
    if (flags.seed & string) != _|_ { seeds[flags.seed] },
    subcases[flags.subcase],
  ], 2), "\n")

  output: strings.Join(list.FlattenN([
    util.#bashHeader,
    script
  ], 2), "\n")

}

#templates: seeds: {
  T: _
  O: strings.Join(list.FlattenN([
    """

    ## \(T.id)
    """,
    if flags.verbose > 1 {
      """
      echo "  adding relns from \(T.id)"
      """
    },
    for m,r in T {[
      if flags.verbose > 2 {
        """
        echo "    adding \(m)"
        """
      },
      """
      run touch "\(r[0])" \(r[1]) "\(r[2])"
      """,
    ]},
  ], 2), "\n")
}

#templates: relations: {
  T: _
  O: strings.Join(list.FlattenN([
    """

    ## \(T.id)
    """,
    if flags.verbose > 1 {
      """
      echo "  adding relns from \(T.id)"
      """
    },
    for m,r in T {[
      if flags.verbose > 2 {
        """
        echo "    adding \(m)"
        """
      },
      """
      run touch "\(r[0])" \(r[1]) "\(r[2])"
      """,
    ]},
  ], 2), "\n")
}
