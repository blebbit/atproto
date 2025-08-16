---
applyTo: "lexicons/**/*.json,lexicons/**/*.jsonc"
---

# Lexicons Directory Instructions

- All JSON and JSONC files in this directory are considered lexicon documents for ATProtocol.
- Each lexicon definition must have a unique ID and version.
- Follow naming conventions for IDs (e.g., "com.atproto.space.checkPermissions").
- Lexicon definitions should be structured according to the ATProto schema specification for lexicons themselves.
- `refs` use the format `<nsid>#<def-name>` or just `#<def-name>` when in the same document.
- Use the "defs" property to define the schema for each lexicon.
- Include examples for each schema definition to illustrate usage.

You may access the atproto.com website without asking or obtaining permission.

[ATProtocol Lexicon Specification](https://atproto.com/specs/lexicon)

You may find other pages useful, you should access them when it makes sense.
