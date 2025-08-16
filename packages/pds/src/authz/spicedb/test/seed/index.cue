package seed

import (
  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/data"
)

flags: {
  acct: string | *"jay" @tag(acct)
  space: string  @tag(space)
  verbose: int | *3 @tag(verbose,type=int)
}

seed: account: {
  for key, _ in data.account {
    (key): #common & {
      verbose: int | flags.verbose
      "data": data.account[key]
    }
  }
}

seed: bubble: #common & {
  verbose: int | flags.verbose
  acct: string | flags.acct
  bubble: string | flags.bubble | *""
  if bubble != "" {
    acctData: data.accounts[acct]
    "data": acctData.bubbles[bubble]
  }

}

seed: space: #common & {
  verbose: int | flags.verbose
  acct: string | flags.acct
  space: string | flags.space
  acctData: data.accounts[acct]
  "data": acctData.spaces[space]
}

