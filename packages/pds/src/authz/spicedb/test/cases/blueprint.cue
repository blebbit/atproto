package cases

// import (
//   "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/seed"
// )

case: blueprint: #case & {
  subcases: {
    default: [
      """
      echo "case/blueprint - default phase"

      # ensuring seeded
      make seed/account.jay

      # running checks
      echo "check/blueprint - default phase"
      mrun "jay own's root space" check 'space:jay/root' record_read 'acct:jay'
      """,
    ]
  }
}
