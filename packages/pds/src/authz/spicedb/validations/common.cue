package validations

import (
  "strings"

  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/util"
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
  relations: [...util.#relation]
  asserts: {
    at: [...util.#check]
    af: [...util.#check]
    ac: [...util.#check]
  }
  validate: [string]: [...util.#check]

  temp: {
    rel: [ for r in relations { (util.#relationTo.spicedbReln & { i: r}).o }]
    ass: {
      at: [ for r in asserts.at { (util.#relationTo.spicedbCheck & { i: r}).o }]
      af: [ for r in asserts.af { (util.#relationTo.spicedbCheck & { i: r}).o }]
      ac: [ for r in asserts.ac { (util.#relationTo.spicedbCheck & { i: r}).o }]
    }
    val: {
      for name,rels in validate {
        (name): [for r in rels { (util.#relationTo.spicedbValidate & { i: r}).o }]
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
}

// #caveats: string | {
//   nsids?: { nsid?: string, allowed?: [...string] }
// }

// _common: {
//   handles: ["jay", "paul", "bryan", "devin", "dholms", "hailey", "darth", "alice"]
//   accts: [ for handle in handles { "acct:\(handle)"} ]
//   roots: [...util.#relation] & [ for handle in handles { "space:\(handle)/root"} ]
// }
