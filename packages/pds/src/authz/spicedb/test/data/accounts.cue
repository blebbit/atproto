package data

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

account: jay: ACCT={
  spaces: {

    bsky: this={
      members: ACCT.acctList
      relns: {
        public_records: [this.id, "record_lister", "anon:user"]
        public_blobs: [this.id, "blob_reader", "anon:user"]
        mod_records: [this.id, "record_deleter", "\(this.id)#member"]
        mod_blobs: [this.id, "blob_deleter", "\(this.id)#member"]
      }
    }

    blog: {
      members: ACCT.acctList
    }
  }

  bubbles: {

    mods: this={
      parent: spaces.bsky.id
      members: ["acct:hailey"]
      relns: {
        // this could be a perm too
        all_records: [this.id, "record_lister", "acct:paul", #"nsids:{"allowed": "bsky_mod_report"}"#]
        all_blobs: [this.id, "blob_lister", "acct:paul", #"nsids:{"allowed": "bsky_mod_report"}"#]
      }
      perms: {
        // resource of this.id is assumed
        all_records: ["record_deleter", "\(this.id)#member"]
        all_blobs: ["blob_deleter", "\(this.id)#member"]
      }
    }

    quad: this={
      members: ["acct:pual", "acct:bryan", "acct:devin"]
      relns: {
        all_records: [this.id, "record_deleter", "\(this.id)#member"]
        all_blobs: [this.id, "blob_deleter", "\(this.id)#member"]
      }
    }
  }
}

account: paul: ACCT={
  spaces: {

    docs: this={
      members: [ for a in ["bryan", "devin", "dholms"] { "acct:\(a)" }]
      relns: {
        public_records: [this.id, "record_lister", "anon:user"]
        public_blobs: [this.id, "blob_reader", "anon:user"]
        member_records: [this.id, "record_deleter", "\(this.id)#member"]
        member_blobs: [this.id, "blob_deleter", "\(this.id)#member"]
      }
    }
    blog: {
      members: ACCT.acctList
    }
  }

}
