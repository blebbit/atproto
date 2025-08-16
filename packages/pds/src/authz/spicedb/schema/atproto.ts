export const spicedbSchema = `
//
// Caveats (CEL expressions)
//

// NSID filtering (think oauth permission sets and check)
caveat nsids(allowed list<string>, nsid string) {
  nsid in allowed
}

definition superuser {}

definition anon {}

definition acct {}

definition oauth {}

definition service {}

definition apikey {}

definition svcacct {}

definition space {
  // relations
  relation direct_member: acct | oauth | service | apikey | svcacct | space#member | bubble#member | group#member
  relation parent: space | bubble
  relation owner: acct | oauth | service | apikey | svcacct | space#member | group#member
  relation bubble_deleter: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation bubble_updater: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation bubble_creator: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation bubble_lister: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation bubble_reader: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation bubble_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation bubble_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation bubble_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation bubble_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_deleter: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_updater: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_creator: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_lister: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_reader: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subrecord_deleter: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subrecord_updater: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subrecord_creator: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subrecord_lister: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subrecord_reader: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subrecord_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subrecord_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subrecord_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subrecord_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subblob_deleter: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subblob_updater: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subblob_creator: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subblob_lister: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subblob_reader: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subblob_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subblob_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subblob_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subblob_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation space_deleter: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation space_updater: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation space_creator: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation space_lister: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation space_reader: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation space_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation space_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation space_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation space_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_deleter: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_updater: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_creator: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_lister: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_reader: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_deleter: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_updater: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_creator: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_lister: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_reader: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_deleter: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_updater: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_creator: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_lister: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_reader: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation rpc_caller: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation rpc_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation rpc_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation rpc_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation rpc_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids

  // permissions
  permission member = owners + direct_member
  permission owners = owner + parent->owners
  permission bubble_delete = owners + bubble_deleter + parent->bubble_delete
  permission bubble_update = bubble_delete + bubble_updater + parent->bubble_update
  permission bubble_create = bubble_update + bubble_creator + parent->bubble_create
  permission bubble_list = owners + bubble_lister + parent->bubble_list
  permission bubble_read = bubble_list + bubble_reader + parent->bubble_read
  permission bubble_iam_admin = owners + bubble_iam_adminer + parent->bubble_iam_admin
  permission bubble_iam_edit = bubble_iam_adminer + bubble_iam_editor + parent->bubble_iam_edit
  permission bubble_iam_list = owners + bubble_iam_lister + parent->bubble_iam_list
  permission bubble_iam_read = bubble_iam_list + bubble_iam_reader + parent->bubble_iam_read
  permission rpc_call = owners + rpc_caller + parent->rpc_call
  permission subrecord_delete = owners + subrecord_deleter + parent->subrecord_delete
  permission subrecord_update = subrecord_delete + subrecord_updater + parent->subrecord_update
  permission subrecord_create = subrecord_update + subrecord_creator + parent->subrecord_create
  permission subrecord_list = owners + subrecord_lister + parent->subrecord_list
  permission subrecord_read = subrecord_list + subrecord_reader + parent->subrecord_read
  permission subrecord_iam_admin = owners + subrecord_iam_adminer + parent->subrecord_iam_admin
  permission subrecord_iam_edit = subrecord_iam_adminer + subrecord_iam_editor + parent->subrecord_iam_edit
  permission subrecord_iam_list = owners + subrecord_iam_lister + parent->subrecord_iam_list
  permission subrecord_iam_read = subrecord_iam_list + subrecord_iam_reader + parent->subrecord_iam_read
  permission subblob_delete = owners + subblob_deleter + parent->subblob_delete
  permission subblob_update = subblob_delete + subblob_updater + parent->subblob_update
  permission subblob_create = subblob_update + subblob_creator + parent->subblob_create
  permission subblob_list = owners + subblob_lister + parent->subblob_list
  permission subblob_read = subblob_list + subblob_reader + parent->subblob_read
  permission subblob_iam_admin = owners + subblob_iam_adminer + parent->subblob_iam_admin
  permission subblob_iam_edit = subblob_iam_adminer + subblob_iam_editor + parent->subblob_iam_edit
  permission subblob_iam_list = owners + subblob_iam_lister + parent->subblob_iam_list
  permission subblob_iam_read = subblob_iam_list + subblob_iam_reader + parent->subblob_iam_read
  permission space_delete = owners + space_deleter + parent->space_delete
  permission space_update = space_delete + space_updater + parent->space_update
  permission space_create = space_update + space_creator + parent->space_create
  permission space_list = owners + space_lister + parent->space_list
  permission space_read = space_list + space_reader + parent->space_read
  permission space_iam_admin = owners + space_iam_adminer + parent->space_iam_admin
  permission space_iam_edit = space_iam_adminer + space_iam_editor + parent->space_iam_edit
  permission space_iam_list = owners + space_iam_lister + parent->space_iam_list
  permission space_iam_read = space_iam_list + space_iam_reader + parent->space_iam_read
  permission group_delete = owners + group_deleter + parent->group_delete
  permission group_update = group_delete + group_updater + parent->group_update
  permission group_create = group_update + group_creator + parent->group_create
  permission group_list = owners + group_lister + parent->group_list
  permission group_read = group_list + group_reader + parent->group_read
  permission group_iam_admin = owners + group_iam_adminer + parent->group_iam_admin
  permission group_iam_edit = group_iam_adminer + group_iam_editor + parent->group_iam_edit
  permission group_iam_list = owners + group_iam_lister + parent->group_iam_list
  permission group_iam_read = group_iam_list + group_iam_reader + parent->group_iam_read
  permission role_delete = owners + role_deleter + parent->role_delete
  permission role_update = role_delete + role_updater + parent->role_update
  permission role_create = role_update + role_creator + parent->role_create
  permission role_list = owners + role_lister + parent->role_list
  permission role_read = role_list + role_reader + parent->role_read
  permission role_iam_admin = owners + role_iam_adminer + parent->role_iam_admin
  permission role_iam_edit = role_iam_adminer + role_iam_editor + parent->role_iam_edit
  permission role_iam_list = owners + role_iam_lister + parent->role_iam_list
  permission role_iam_read = role_iam_list + role_iam_reader + parent->role_iam_read
  permission record_delete = owners + record_deleter + parent->record_delete
  permission record_update = record_delete + record_updater + parent->record_update
  permission record_create = record_update + record_creator + parent->record_create
  permission record_list = owners + record_lister + parent->record_list
  permission record_read = record_list + record_reader + parent->record_read
  permission record_iam_admin = owners + record_iam_adminer + parent->record_iam_admin
  permission record_iam_edit = record_iam_adminer + record_iam_editor + parent->record_iam_edit
  permission record_iam_list = owners + record_iam_lister + parent->record_iam_list
  permission record_iam_read = record_iam_list + record_iam_reader + parent->record_iam_read
  permission blob_delete = owners + blob_deleter + parent->blob_delete
  permission blob_update = blob_delete + blob_updater + parent->blob_update
  permission blob_create = blob_update + blob_creator + parent->blob_create
  permission blob_list = owners + blob_lister + parent->blob_list
  permission blob_read = blob_list + blob_reader + parent->blob_read
  permission blob_iam_admin = owners + blob_iam_adminer + parent->blob_iam_admin
  permission blob_iam_edit = blob_iam_adminer + blob_iam_editor + parent->blob_iam_edit
  permission blob_iam_list = owners + blob_iam_lister + parent->blob_iam_list
  permission blob_iam_read = blob_iam_list + blob_iam_reader + parent->blob_iam_read
  permission rpc_iam_admin = owners + rpc_iam_adminer + parent->rpc_iam_admin
  permission rpc_iam_edit = rpc_iam_adminer + rpc_iam_editor + parent->rpc_iam_edit
  permission rpc_iam_list = owners + rpc_iam_lister + parent->rpc_iam_list
  permission rpc_iam_read = rpc_iam_list + rpc_iam_reader + parent->rpc_iam_read
}

definition bubble {
  // relations
  relation direct_member: acct | oauth | service | apikey | svcacct | space#member | bubble#member | group#member
  relation parent: space | bubble
  relation owner: acct | oauth | service | apikey | svcacct | space#member | group#member
  relation bubble_deleter: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation bubble_updater: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation bubble_creator: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation bubble_lister: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation bubble_reader: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation bubble_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation bubble_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation bubble_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation bubble_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_deleter: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_updater: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_creator: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_lister: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_reader: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subrecord_deleter: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subrecord_updater: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subrecord_creator: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subrecord_lister: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subrecord_reader: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subrecord_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subrecord_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subrecord_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subrecord_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subblob_deleter: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subblob_updater: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subblob_creator: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subblob_lister: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subblob_reader: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subblob_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subblob_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subblob_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation subblob_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation space_deleter: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation space_updater: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation space_creator: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation space_lister: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation space_reader: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation space_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation space_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation space_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation space_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_deleter: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_updater: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_creator: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_lister: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_reader: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_deleter: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_updater: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_creator: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_lister: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_reader: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_deleter: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_updater: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_creator: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_lister: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_reader: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation rpc_caller: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation rpc_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation rpc_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation rpc_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation rpc_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids

  // permissions
  permission member = owners + direct_member
  permission owners = owner + parent->owners
  permission rpc_call = owners + rpc_caller
  permission space_delete = owners + space_deleter
  permission space_update = space_delete + space_updater
  permission space_create = space_update + space_creator
  permission space_list = owners + space_lister
  permission space_read = space_list + space_reader
  permission space_iam_admin = owners + space_iam_adminer
  permission space_iam_edit = space_iam_adminer + space_iam_editor
  permission space_iam_list = owners + space_iam_lister
  permission space_iam_read = space_iam_list + space_iam_reader
  permission group_delete = owners + group_deleter
  permission group_update = group_delete + group_updater
  permission group_create = group_update + group_creator
  permission group_list = owners + group_lister
  permission group_read = group_list + group_reader
  permission group_iam_admin = owners + group_iam_adminer
  permission group_iam_edit = group_iam_adminer + group_iam_editor
  permission group_iam_list = owners + group_iam_lister
  permission group_iam_read = group_iam_list + group_iam_reader
  permission role_delete = owners + role_deleter
  permission role_update = role_delete + role_updater
  permission role_create = role_update + role_creator
  permission role_list = owners + role_lister
  permission role_read = role_list + role_reader
  permission role_iam_admin = owners + role_iam_adminer
  permission role_iam_edit = role_iam_adminer + role_iam_editor
  permission role_iam_list = owners + role_iam_lister
  permission role_iam_read = role_iam_list + role_iam_reader
  permission record_delete = owners + record_deleter
  permission record_update = record_delete + record_updater
  permission record_create = record_update + record_creator
  permission record_list = owners + record_lister
  permission record_read = record_list + record_reader
  permission record_iam_admin = owners + record_iam_adminer
  permission record_iam_edit = record_iam_adminer + record_iam_editor
  permission record_iam_list = owners + record_iam_lister
  permission record_iam_read = record_iam_list + record_iam_reader
  permission blob_delete = owners + blob_deleter
  permission blob_update = blob_delete + blob_updater
  permission blob_create = blob_update + blob_creator
  permission blob_list = owners + blob_lister
  permission blob_read = blob_list + blob_reader
  permission blob_iam_admin = owners + blob_iam_adminer
  permission blob_iam_edit = blob_iam_adminer + blob_iam_editor
  permission blob_iam_list = owners + blob_iam_lister
  permission blob_iam_read = blob_iam_list + blob_iam_reader
  permission rpc_iam_admin = owners + rpc_iam_adminer
  permission rpc_iam_edit = rpc_iam_adminer + rpc_iam_editor
  permission rpc_iam_list = owners + rpc_iam_lister
  permission rpc_iam_read = rpc_iam_list + rpc_iam_reader
  permission subrecord_iam_admin = owners + subrecord_iam_adminer
  permission subrecord_iam_edit = subrecord_iam_adminer + subrecord_iam_editor
  permission subrecord_iam_list = owners + subrecord_iam_lister
  permission subrecord_iam_read = subrecord_iam_list + subrecord_iam_reader
  permission subblob_iam_admin = owners + subblob_iam_adminer
  permission subblob_iam_edit = subblob_iam_adminer + subblob_iam_editor
  permission subblob_iam_list = owners + subblob_iam_lister
  permission subblob_iam_read = subblob_iam_list + subblob_iam_reader
  permission bubble_delete = owners + bubble_deleter
  permission bubble_update = bubble_delete + bubble_updater
  permission bubble_create = bubble_update + bubble_creator
  permission bubble_list = owners + bubble_lister
  permission bubble_read = bubble_list + bubble_reader
  permission bubble_iam_admin = owners + bubble_iam_adminer
  permission bubble_iam_edit = bubble_iam_adminer + bubble_iam_editor
  permission bubble_iam_list = owners + bubble_iam_lister
  permission bubble_iam_read = bubble_iam_list + bubble_iam_reader
}

definition group {
  // relations
  relation direct_member: acct | oauth | service | apikey | svcacct | space#member | bubble#member | group#member
  relation parent: space | bubble
  relation owner: acct | oauth | service | apikey | svcacct | space#member | group#member
  relation group_deleter: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_updater: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_creator: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_lister: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_reader: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation group_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids

  // permissions
  permission owners = owner + parent->owners
  permission member = owners + direct_member
  permission group_delete = owners + group_deleter + parent->group_delete
  permission group_update = group_delete + group_updater + parent->group_update
  permission group_create = group_update + group_creator + parent->group_create
  permission group_list = owners + group_lister + parent->group_list
  permission group_read = group_list + group_reader + parent->group_read
  permission group_iam_admin = owners + group_iam_adminer + parent->group_iam_admin
  permission group_iam_edit = group_iam_adminer + group_iam_editor + parent->group_iam_edit
  permission group_iam_list = owners + group_iam_lister + parent->group_iam_list
  permission group_iam_read = group_iam_list + group_iam_reader + parent->group_iam_read
}

definition role {
  // relations
  relation direct_member: acct | oauth | service | apikey | svcacct | space#member | bubble#member | group#member
  relation parent: space | bubble
  relation owner: acct | oauth | service | apikey | svcacct | space#member | group#member
  relation role_deleter: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_updater: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_creator: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_lister: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_reader: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation role_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids

  // permissions
  permission owners = owner + parent->owners
  permission member = owners + direct_member
  permission role_delete = owners + role_deleter + parent->role_delete
  permission role_update = role_delete + role_updater + parent->role_update
  permission role_create = role_update + role_creator + parent->role_create
  permission role_list = owners + role_lister + parent->role_list
  permission role_read = role_list + role_reader + parent->role_read
  permission role_iam_admin = owners + role_iam_adminer + parent->role_iam_admin
  permission role_iam_edit = role_iam_adminer + role_iam_editor + parent->role_iam_edit
  permission role_iam_list = owners + role_iam_lister + parent->role_iam_list
  permission role_iam_read = role_iam_list + role_iam_reader + parent->role_iam_read
}

definition record {
  // relations
  relation direct_member: acct | oauth | service | apikey | svcacct | space#member | bubble#member | group#member
  relation parent: space | bubble
  relation owner: acct | oauth | service | apikey | svcacct | space#member | group#member
  relation blob_deleter: superuser | record#member | record#member with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_updater: superuser | record#member | record#member with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_creator: superuser | record#member | record#member with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_lister: superuser | record#member | record#member with nsids | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_reader: superuser | record#member | record#member with nsids | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_iam_adminer: superuser | record#member | record#member with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_iam_editor: superuser | record#member | record#member with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_iam_lister: superuser | record#member | record#member with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_iam_reader: superuser | record#member | record#member with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_deleter: superuser | record#member | record#member with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_updater: superuser | record#member | record#member with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_creator: superuser | record#member | record#member with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_lister: superuser | record#member | record#member with nsids | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_reader: superuser | record#member | record#member with nsids | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_iam_adminer: superuser | record#member | record#member with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_iam_editor: superuser | record#member | record#member with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_iam_lister: superuser | record#member | record#member with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation record_iam_reader: superuser | record#member | record#member with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids

  // permissions
  permission owners = owner + parent->owners
  permission member = owners + direct_member
  permission subrecord_delete = owners + subrecord_deleter + parent->subrecord_delete
  permission subrecord_update = subrecord_delete + subrecord_updater + parent->subrecord_update
  permission subrecord_create = subrecord_update + subrecord_creator + parent->subrecord_create
  permission subrecord_list = owners + subrecord_lister + parent->subrecord_list
  permission subrecord_read = subrecord_list + subrecord_reader + parent->subrecord_read
  permission subrecord_iam_admin = owners + subrecord_iam_adminer + parent->subrecord_iam_admin
  permission subrecord_iam_edit = subrecord_iam_adminer + subrecord_iam_editor + parent->subrecord_iam_edit
  permission subrecord_iam_list = owners + subrecord_iam_lister + parent->subrecord_iam_list
  permission subrecord_iam_read = subrecord_iam_list + subrecord_iam_reader + parent->subrecord_iam_read
  permission subblob_delete = owners + subblob_deleter + parent->subblob_delete
  permission subblob_update = subblob_delete + subblob_updater + parent->subblob_update
  permission subblob_create = subblob_update + subblob_creator + parent->subblob_create
  permission subblob_list = owners + subblob_lister + parent->subblob_list
  permission subblob_read = subblob_list + subblob_reader + parent->subblob_read
  permission subblob_iam_admin = owners + subblob_iam_adminer + parent->subblob_iam_admin
  permission subblob_iam_edit = subblob_iam_adminer + subblob_iam_editor + parent->subblob_iam_edit
  permission subblob_iam_list = owners + subblob_iam_lister + parent->subblob_iam_list
  permission subblob_iam_read = subblob_iam_list + subblob_iam_reader + parent->subblob_iam_read
  permission record_delete = owners + record_deleter + parent->record_delete
  permission record_update = record_delete + record_updater + parent->record_update
  permission record_create = record_update + record_creator + parent->record_create
  permission record_list = owners + record_lister + parent->record_list
  permission record_read = record_list + record_reader + parent->record_read
  permission record_iam_admin = owners + record_iam_adminer + parent->record_iam_admin
  permission record_iam_edit = record_iam_adminer + record_iam_editor + parent->record_iam_edit
  permission record_iam_list = owners + record_iam_lister + parent->record_iam_list
  permission record_iam_read = record_iam_list + record_iam_reader + parent->record_iam_read
  permission blob_delete = owners + blob_deleter + parent->blob_delete
  permission blob_update = blob_delete + blob_updater + parent->blob_update
  permission blob_create = blob_update + blob_creator + parent->blob_create
  permission blob_list = owners + blob_lister + parent->blob_list
  permission blob_read = blob_list + blob_reader + parent->blob_read
  permission blob_iam_admin = owners + blob_iam_adminer + parent->blob_iam_admin
  permission blob_iam_edit = blob_iam_adminer + blob_iam_editor + parent->blob_iam_edit
  permission blob_iam_list = owners + blob_iam_lister + parent->blob_iam_list
  permission blob_iam_read = blob_iam_list + blob_iam_reader + parent->blob_iam_read
}

definition blob {
  // relations
  relation direct_member: acct | oauth | service | apikey | svcacct | space#member | bubble#member | group#member
  relation parent: space | bubble
  relation owner: acct | oauth | service | apikey | svcacct | space#member | group#member
  relation blob_deleter: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_updater: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_creator: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_lister: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_reader: superuser | anon:* | anon:* with nsids | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation blob_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids

  // permissions
  permission owners = owner + parent->owners
  permission member = owners + direct_member
  permission blob_delete = owners + blob_deleter + parent->blob_delete
  permission blob_update = blob_delete + blob_updater + parent->blob_update
  permission blob_create = blob_update + blob_creator + parent->blob_create
  permission blob_list = owners + blob_lister + parent->blob_list
  permission blob_read = blob_list + blob_reader + parent->blob_read
  permission blob_iam_admin = owners + blob_iam_adminer + parent->blob_iam_admin
  permission blob_iam_edit = blob_iam_adminer + blob_iam_editor + parent->blob_iam_edit
  permission blob_iam_list = owners + blob_iam_lister + parent->blob_iam_list
  permission blob_iam_read = blob_iam_list + blob_iam_reader + parent->blob_iam_read
}

definition rpc {
  // relations
  relation parent: space | bubble
  relation owner: acct | oauth | service | apikey | svcacct | space#member | group#member
  relation rpc_caller: superuser | acct:* | acct:* with nsids | oauth:* | oauth:* with nsids | service:* | service:* with nsids | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation rpc_iam_adminer: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation rpc_iam_editor: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation rpc_iam_lister: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids
  relation rpc_iam_reader: superuser | acct | acct with nsids | oauth | oauth with nsids | service | service with nsids | apikey | apikey with nsids | svcacct | svcacct with nsids | space#member | space#member with nsids | bubble#member | bubble#member with nsids | group#member | group#member with nsids | role#member | role#member with nsids

  // permissions
  permission owners = owner + parent->owners
  permission rpc_call = owners + rpc_caller + parent->rpc_call
  permission rpc_iam_admin = owners + rpc_iam_adminer + parent->rpc_iam_admin
  permission rpc_iam_edit = rpc_iam_adminer + rpc_iam_editor + parent->rpc_iam_edit
  permission rpc_iam_list = owners + rpc_iam_lister + parent->rpc_iam_list
  permission rpc_iam_read = rpc_iam_list + rpc_iam_reader + parent->rpc_iam_read
}
`;
