package space

import (
	"github.com/hofstadter-io/schemas/gen"

	lex "github.com/blebbit/atproto/lexicons/com/atproto/space/flexicon"
)

Generator: gen.Generator & {

  ModuleName: "github.com/blebbit/atproto/packages/pds/src/api/com/atproto/space"

  In: {
    LEXICONS: lex.lexicon
  }

  Out: [
    {
      Filepath: "debug.yaml"
      Val: In
    },
    {
      TemplatePath: "index.ts"
      Filepath: "index.ts"
    },
    for l, L in lex.methods {
      In: {
        NAME: l
        LEX: L
        MAIN: L.defs.main
      }
      TemplatePath: "handler.ts"
      Filepath: "\(l).ts"
    },
  ]
	// Template (top-level) TemplateConfig (globs+config)
	Templates: [{
		Globs: ["./packages/pds/src/api/com/atproto/space/templates/**/*"]
		TrimPrefix: "./packages/pds/src/api/com/atproto/space/templates/"
	}]

	// Partial (nested) TemplateConfig (globs+config)
  Partials: []
	// Partials: [{
	// 	Globs: ["./packages/pds/src/api/com/atproto/space/partials/**/*"]
	// 	TrimPrefix: "./packages/pds/src/api/com/atproto/space/partials/"
	// }]

	// Statics are copied directly into the output, bypassing the rendering
	Statics: []
	// Statics: [{
	// 	Globs: ["./packages/pds/src/api/com/atproto/space/statics/**/*"]
	// 	TrimPrefix: "./packages/pds/src/api/com/atproto/space/statics/"
	// }]
}
