package data

import (
  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/util"
)

_acctList: ["jay", "paul", "bryan", "devin", "dholms", "hailey"]

// enforce existance of accounts without being defined
account: {
  for a in _acctList {
    (a): {}
  }
}

account: [n=string]: #account & {
  name: n
  acctList: [for a in _acctList if a != n { "acct:\(a)"}]
}
#account: {
  $kind: "account"
  name: string
  parent: "acct:self"

  // all accounts minus self
  acctList: [...string]

  #common
  #content

  // set some known / default values
  id: "acct:\(name)"
  root: "space:\(name)/root"
  relns: {
    acct_root: ["space:\(name)/root", "owner", "acct:\(name)"]
  }

  // set some known / default into sub values
  for s in ["space", "bubble", "group", "role"] {
    "\(s)s": [n=string]: {
      id: "\(s):\(name)/\(n)"
      parent: string | *root
    }
  }
  spaces: [n=string]: {
    id: "space:\(name)/\(n)"
    parent: string | *root
  }
  bubbles: [n=string]: {
    id: "bubble:\(name)/\(n)"
    parent: string | *root
  }
  groups: [n=string]: {
    id: "group:\(name)/\(n)"
    parent: string | *root
  }
  roles: [n=string]: {
    id: "role:\(name)/\(n)"
    parent: string | *root
  }

}

#common: {
  // lineage in the content tree
  $kind: string
  name: string
  id: string
  parent: string

  // relations to create with this resource
  relns: [msg=string]: util.#relation

  // member spicedb subj keys
  members: [...string]

  // member (role) permissions [resource,relation]
  perms: [msg=string]: [string,string]
}

#content: {
  // for spaces and bubbles
  spaces: [n=string]: #space & { name: n }
  bubbles: [n=string]: #bubble & { name: n }
  groups: [n=string]: #group & { name: n }
  roles: [n=string]: #role & { name: n }
  records: [n=string]: #record & { name: n }
}

#space: {
  $kind: "space"
  #common
  #content
}
#bubble: {
  $kind: "bubble"
  #common
  #content
}

#group: {
  $kind: "group"
  #common
}
#role: {
  $kind: "role"
  #common
}
#record: {
  $kind: "record"
  #common
}
#blob: {
  $kind: "blob"
  #common
}
