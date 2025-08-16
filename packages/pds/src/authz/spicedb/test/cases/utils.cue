package cases

import (
  "list"
  "strings"
)

#heading: {
  H: string
  O: "\n#\n# \(H)\n#"
}

flags: {
  clean:   string @tag(clean)
  verbose: int | *0 @tag(verbose,type=int)
  seed:    string | *"" @tag(seed)
  subcase: string | *"default" @tag(subcase)
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
