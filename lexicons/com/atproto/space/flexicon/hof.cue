package flexicon

import (
	"github.com/hofstadter-io/schemas/gen"
)

Generator: gen.Generator & {

  ModuleName: "github.com/blebbit/atproto/lexicon/com/atproto/space/flexicon"

  Diff3: false

  Out: [
    for l, L in lexicon {
      Val: L
      Filepath: "\(l).json"
    },
  ]

  Templates: []
  Partials: []
	Statics: []
}
