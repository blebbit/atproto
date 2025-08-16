package data

// enumtree: [n=string]: #account & {
//   name: n
// }

// enumtree: main: ACCT={

//   acctList: [for i in [1,2,3,4,5] { "acct:user-\(i)"}]

//   spaces: {
//     s1: this={
//       members: ACCT.acctList
//       relns: {
//         public_nsid: [this.id, "nsid_lister", "anon:user"]
//         public_records: [this.id, "record_lister", "anon:user"]
//         public_blobs: [this.id, "blob_reader", "anon:user"]
//         mod_records: [this.id, "record_deleter", "\(this.id)#member"]
//         mod_blobs: [this.id, "blob_deleter", "\(this.id)#member"]
//       }
//     }

//     s2: {
//       members: ACCT.acctList[:3]
//     }
//   }
//   bubbles: {
//     b1: this={
//       parent: spaces.bsky.id
//       members: ["user-4"]
//       relns: {
//         // this could be a perm too
//         all_records: [this.id, "record_lister", "acct:paul", #"nsids:{"allowed": "bsky_mod_report"}"#]
//         all_blobs: [this.id, "blob_lister", "acct:paul", #"nsids:{"allowed": "bsky_mod_report"}"#]
//       }
//       perms: {
//         // resource of this.id is assumed
//         all_records: ["record_deleter", "\(this.id)#member"]
//         all_blobs: ["blob_deleter", "\(this.id)#member"]
//       }
//     }

//     b2: this={
//       members: ["acct:user-1", "acct:user-2", "acct:user-3"]
//       relns: {
//         all_records: [this.id, "record_deleter", "\(this.id)#member"]
//         all_blobs: [this.id, "blob_deleter", "\(this.id)#member"]
//       }
//     }
//   }
// }