package validations

import (
  "strings"

  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/utils"
)

//
// defs as CUE schema
//

// spicedb validation file
#spicedb: {
  schemaFile: string
  relationships: string
  assertions?: {
    assertTrue?: [...string]
    assertFalse?: [...string]
    assertCaveated?: [...string]
  }
  validation: [string]: [...string]
}

// internal representation for a  validation file
#validation: {
  relations: [...utils.#relation]
  asserts: {
    at: [...utils.#relation]
    af: [...utils.#relation]
    ac: [...utils.#relation]
  }
  validate: [string]: [...utils.#relation]

  temp: {
    rel: [ for r in relations { (utils.#relationTo.spicedbReln & { i: r}).o }]
    ass: {
      at: [ for r in asserts.at { (utils.#relationTo.spicedbCheck & { i: r}).o }]
      af: [ for r in asserts.af { (utils.#relationTo.spicedbCheck & { i: r}).o }]
      ac: [ for r in asserts.ac { (utils.#relationTo.spicedbCheck & { i: r}).o }]
    }
    val: {
      for name,rels in validate {
        (name): [for r in rels { (utils.#relationTo.spicedbValidate & { i: r}).o }]
      }
    }
  }

  output: #spicedb
  output: {
    schemaFile: string | *"../schema/atproto.zed"
    relationships: strings.Join(temp.rel, "\n")
    assertions: {
      assertTrue: temp.ass.at
      assertFalse: temp.ass.af
      assertCaveated: temp.ass.ac
    }
    validation: temp.val
  }

  ...
}

// #caveats: string | {
//   nsids?: { nsid?: string, allowed?: [...string] }
// }

// _common: {
//   handles: ["jay", "paul", "bryan", "devin", "dholms", "hailey", "darth", "alice"]
//   accts: [ for handle in handles { "acct:\(handle)"} ]
//   roots: [...utils.#relation] & [ for handle in handles { "space:\(handle)/root"} ]
// }
