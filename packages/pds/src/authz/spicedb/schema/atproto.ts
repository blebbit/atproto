export const spicedbSchema = `
// not all are used yet
definition anon {}

definition user {}

definition oauth {}

definition apikey {}

definition svcacct {}

definition service {}

definition superuser {}

// custom roles
definition role {
	relation parent: space
	relation member: user | apikey | service | svcacct | space#member | group#member

	// every resource gets a default owner of the account the resources live under
	// the owner role can be given to other users or generally subjects too
	// ... or does the creator of the record get some ownership in the account, how much appview purview here?
	// does super user god here, because super user
	relation owner: user | apikey | service | group#member | role#member

	// Role CRUD relations
	// what about user:* for all logged in users vs anon visitors
	// what about superuser?
	relation role_deleter: user | apikey | service | space#member | group#member | role#member
	relation role_updater: user | apikey | service | space#member | group#member | role#member
	relation role_creater: user | apikey | service | space#member | group#member | role#member
	relation role_lister: user | apikey | service | space#member | group#member | role#member | anon
	relation role_reader: user | apikey | service | space#member | group#member | role#member | anon

	// Role CRUD permissions
	permission role_delete = owner + role_deleter + parent->role_delete
	permission role_update = role_delete + role_updater + parent->role_update
	permission role_create = role_update + role_creater + parent->role_create
	permission role_list = role_create + role_lister + parent->role_list
	permission role_read = role_list + role_reader + parent->role_read

	// Role IAM relations
	relation role_iam_adminer: user | apikey | service | space#member | group#member | role#member
	relation role_iam_editor: user | apikey | service | space#member | group#member | role#member
	relation role_iam_lister: user | apikey | service | space#member | group#member | role#member
	relation role_iam_reader: user | apikey | service | space#member | group#member | role#member

	// Role IAM permissions
	permission role_iam_admin = owner + role_iam_adminer + parent->role_iam_admin
	permission role_iam_edit = role_iam_admin + role_iam_editor + parent->role_iam_edit
	permission role_iam_list = role_iam_edit + role_iam_lister + parent->role_iam_list
	permission role_iam_read = role_iam_list + role_iam_reader + parent->role_iam_read
}

definition space {
	// space containment / nesting
	relation parent: space

	// spaces can nest
	relation direct_member: user | apikey | service | space#member | group#member

	// pseudo member role as a permission
	permission member = owner + direct_member + space_creater + space_updater + space_deleter + space_lister + space_reader + space_iam_admin + space_iam_editor + space_iam_lister + space_iam_reader

	// every resource gets a default owner of the account the resources live under
	// the owner role can be given to other users or generally subjects too
	// ... or does the creator of the record get some ownership in the account, how much appview purview here?
	// does super user god here, because super user
	relation owner: user | apikey | service | group#member | role#member

	// various negating relations (should / do we need all of these here)
	relation blocked: user | apikey | service
	relation muted: user | apikey | service
	relation banned: user | apikey | service
	relation takendown: user | apikey | service

	// Space CRUD relations
	// what about user:* for all logged in users vs anon visitors
	// what about superuser?
	relation space_deleter: user | apikey | service | space#member | group#member | role#member
	relation space_updater: user | apikey | service | space#member | group#member | role#member
	relation space_creater: user | apikey | service | space#member | group#member | role#member
	relation space_lister: user | apikey | service | space#member | group#member | role#member | anon
	relation space_reader: user | apikey | service | space#member | group#member | role#member | anon

	// Space CRUD permissions
	permission space_delete = owner + space_deleter + parent->space_delete
	permission space_update = space_delete + space_updater + parent->space_update
	permission space_create = space_update + space_creater + parent->space_create
	permission space_list = space_create + space_lister + parent->space_list
	permission space_read = space_list + space_reader + parent->space_read

	// Space IAM relations
	relation space_iam_adminer: user | apikey | service | space#member | group#member | role#member
	relation space_iam_editor: user | apikey | service | space#member | group#member | role#member
	relation space_iam_lister: user | apikey | service | space#member | group#member | role#member
	relation space_iam_reader: user | apikey | service | space#member | group#member | role#member

	// Space IAM permissions
	permission space_iam_admin = owner + space_iam_adminer + parent->space_iam_admin
	permission space_iam_edit = space_iam_admin + space_iam_editor + parent->space_iam_edit
	permission space_iam_list = space_iam_edit + space_iam_lister + parent->space_iam_list
	permission space_iam_read = space_iam_list + space_iam_reader + parent->space_iam_read

	// Group CRUD relations
	// what about user:* for all logged in users vs anon visitors
	// what about superuser?
	relation group_deleter: user | apikey | service | space#member | group#member | role#member
	relation group_updater: user | apikey | service | space#member | group#member | role#member
	relation group_creater: user | apikey | service | space#member | group#member | role#member
	relation group_lister: user | apikey | service | space#member | group#member | role#member | anon
	relation group_reader: user | apikey | service | space#member | group#member | role#member | anon

	// Group CRUD permissions
	permission group_delete = owner + group_deleter + parent->group_delete
	permission group_update = group_delete + group_updater + parent->group_update
	permission group_create = group_update + group_creater + parent->group_create
	permission group_list = group_create + group_lister + parent->group_list
	permission group_read = group_list + group_reader + parent->group_read

	// Group IAM relations
	relation group_iam_adminer: user | apikey | service | space#member | group#member | role#member
	relation group_iam_editor: user | apikey | service | space#member | group#member | role#member
	relation group_iam_lister: user | apikey | service | space#member | group#member | role#member
	relation group_iam_reader: user | apikey | service | space#member | group#member | role#member

	// Group IAM permissions
	permission group_iam_admin = owner + group_iam_adminer + parent->group_iam_admin
	permission group_iam_edit = group_iam_admin + group_iam_editor + parent->group_iam_edit
	permission group_iam_list = group_iam_edit + group_iam_lister + parent->group_iam_list
	permission group_iam_read = group_iam_list + group_iam_reader + parent->group_iam_read

	// Role CRUD relations
	// what about user:* for all logged in users vs anon visitors
	// what about superuser?
	relation role_deleter: user | apikey | service | space#member | group#member | role#member
	relation role_updater: user | apikey | service | space#member | group#member | role#member
	relation role_creater: user | apikey | service | space#member | group#member | role#member
	relation role_lister: user | apikey | service | space#member | group#member | role#member | anon
	relation role_reader: user | apikey | service | space#member | group#member | role#member | anon

	// Role CRUD permissions
	permission role_delete = owner + role_deleter + parent->role_delete
	permission role_update = role_delete + role_updater + parent->role_update
	permission role_create = role_update + role_creater + parent->role_create
	permission role_list = role_create + role_lister + parent->role_list
	permission role_read = role_list + role_reader + parent->role_read

	// Role IAM relations
	relation role_iam_adminer: user | apikey | service | space#member | group#member | role#member
	relation role_iam_editor: user | apikey | service | space#member | group#member | role#member
	relation role_iam_lister: user | apikey | service | space#member | group#member | role#member
	relation role_iam_reader: user | apikey | service | space#member | group#member | role#member

	// Role IAM permissions
	permission role_iam_admin = owner + role_iam_adminer + parent->role_iam_admin
	permission role_iam_edit = role_iam_admin + role_iam_editor + parent->role_iam_edit
	permission role_iam_list = role_iam_edit + role_iam_lister + parent->role_iam_list
	permission role_iam_read = role_iam_list + role_iam_reader + parent->role_iam_read

	// NSID CRUD relations
	// what about user:* for all logged in users vs anon visitors
	// what about superuser?
	relation nsid_deleter: user | apikey | service | space#member | group#member | role#member
	relation nsid_updater: user | apikey | service | space#member | group#member | role#member
	relation nsid_creater: user | apikey | service | space#member | group#member | role#member
	relation nsid_lister: user | apikey | service | space#member | group#member | role#member | anon
	relation nsid_reader: user | apikey | service | space#member | group#member | role#member | anon

	// NSID CRUD permissions
	permission nsid_delete = owner + nsid_deleter + parent->nsid_delete
	permission nsid_update = nsid_delete + nsid_updater + parent->nsid_update
	permission nsid_create = nsid_update + nsid_creater + parent->nsid_create
	permission nsid_list = nsid_create + nsid_lister + parent->nsid_list
	permission nsid_read = nsid_list + nsid_reader + parent->nsid_read

	// NSID IAM relations
	relation nsid_iam_adminer: user | apikey | service | space#member | group#member | role#member
	relation nsid_iam_editor: user | apikey | service | space#member | group#member | role#member
	relation nsid_iam_lister: user | apikey | service | space#member | group#member | role#member
	relation nsid_iam_reader: user | apikey | service | space#member | group#member | role#member

	// NSID IAM permissions
	permission nsid_iam_admin = owner + nsid_iam_adminer + parent->nsid_iam_admin
	permission nsid_iam_edit = nsid_iam_admin + nsid_iam_editor + parent->nsid_iam_edit
	permission nsid_iam_list = nsid_iam_edit + nsid_iam_lister + parent->nsid_iam_list
	permission nsid_iam_read = nsid_iam_list + nsid_iam_reader + parent->nsid_iam_read

	// RPC CRUD relations
	// what about user:* for all logged in users vs anon visitors
	// what about superuser?
	relation rpc_deleter: user | apikey | service | space#member | group#member | role#member
	relation rpc_updater: user | apikey | service | space#member | group#member | role#member
	relation rpc_creater: user | apikey | service | space#member | group#member | role#member
	relation rpc_lister: user | apikey | service | space#member | group#member | role#member | anon
	relation rpc_reader: user | apikey | service | space#member | group#member | role#member | anon

	// RPC CRUD permissions
	permission rpc_delete = owner + rpc_deleter + parent->rpc_delete
	permission rpc_update = rpc_delete + rpc_updater + parent->rpc_update
	permission rpc_create = rpc_update + rpc_creater + parent->rpc_create
	permission rpc_list = rpc_create + rpc_lister + parent->rpc_list
	permission rpc_read = rpc_list + rpc_reader + parent->rpc_read

	// RPC IAM relations
	relation rpc_iam_adminer: user | apikey | service | space#member | group#member | role#member
	relation rpc_iam_editor: user | apikey | service | space#member | group#member | role#member
	relation rpc_iam_lister: user | apikey | service | space#member | group#member | role#member
	relation rpc_iam_reader: user | apikey | service | space#member | group#member | role#member

	// RPC IAM permissions
	permission rpc_iam_admin = owner + rpc_iam_adminer + parent->rpc_iam_admin
	permission rpc_iam_edit = rpc_iam_admin + rpc_iam_editor + parent->rpc_iam_edit
	permission rpc_iam_list = rpc_iam_edit + rpc_iam_lister + parent->rpc_iam_list
	permission rpc_iam_read = rpc_iam_list + rpc_iam_reader + parent->rpc_iam_read

	// Record CRUD relations
	// what about user:* for all logged in users vs anon visitors
	// what about superuser?
	relation record_deleter: user | apikey | service | space#member | group#member | role#member
	relation record_updater: user | apikey | service | space#member | group#member | role#member
	relation record_creater: user | apikey | service | space#member | group#member | role#member
	relation record_lister: user | apikey | service | space#member | group#member | role#member | anon
	relation record_reader: user | apikey | service | space#member | group#member | role#member | anon

	// Record CRUD permissions
	permission record_delete = owner + record_deleter + parent->record_delete
	permission record_update = record_delete + record_updater + parent->record_update
	permission record_create = record_update + record_creater + parent->record_create
	permission record_list = record_create + record_lister + parent->record_list
	permission record_read = record_list + record_reader + parent->record_read

	// Record IAM relations
	relation record_iam_adminer: user | apikey | service | space#member | group#member | role#member
	relation record_iam_editor: user | apikey | service | space#member | group#member | role#member
	relation record_iam_lister: user | apikey | service | space#member | group#member | role#member
	relation record_iam_reader: user | apikey | service | space#member | group#member | role#member

	// Record IAM permissions
	permission record_iam_admin = owner + record_iam_adminer + parent->record_iam_admin
	permission record_iam_edit = record_iam_admin + record_iam_editor + parent->record_iam_edit
	permission record_iam_list = record_iam_edit + record_iam_lister + parent->record_iam_list
	permission record_iam_read = record_iam_list + record_iam_reader + parent->record_iam_read

	// Blob CRUD relations
	// what about user:* for all logged in users vs anon visitors
	// what about superuser?
	relation blob_deleter: user | apikey | service | space#member | group#member | role#member
	relation blob_updater: user | apikey | service | space#member | group#member | role#member
	relation blob_creater: user | apikey | service | space#member | group#member | role#member
	relation blob_lister: user | apikey | service | space#member | group#member | role#member | anon
	relation blob_reader: user | apikey | service | space#member | group#member | role#member | anon

	// Blob CRUD permissions
	permission blob_delete = owner + blob_deleter + parent->blob_delete
	permission blob_update = blob_delete + blob_updater + parent->blob_update
	permission blob_create = blob_update + blob_creater + parent->blob_create
	permission blob_list = blob_create + blob_lister + parent->blob_list
	permission blob_read = blob_list + blob_reader + parent->blob_read

	// Blob IAM relations
	relation blob_iam_adminer: user | apikey | service | space#member | group#member | role#member
	relation blob_iam_editor: user | apikey | service | space#member | group#member | role#member
	relation blob_iam_lister: user | apikey | service | space#member | group#member | role#member
	relation blob_iam_reader: user | apikey | service | space#member | group#member | role#member

	// Blob IAM permissions
	permission blob_iam_admin = owner + blob_iam_adminer + parent->blob_iam_admin
	permission blob_iam_edit = blob_iam_admin + blob_iam_editor + parent->blob_iam_edit
	permission blob_iam_list = blob_iam_edit + blob_iam_lister + parent->blob_iam_list
	permission blob_iam_read = blob_iam_list + blob_iam_reader + parent->blob_iam_read
}

definition group {
	// space containment / nesting
	relation parent: space

	// groups are orthogonal to content
	relation direct_member: user | apikey | service | space#member | group#member

	// pseudo member role as a permission
	permission member = owner + direct_member + group_iam_admin + group_iam_editor + group_iam_lister + group_iam_reader

	// every resource gets a default owner of the account the resources live under
	// the owner role can be given to other users or generally subjects too
	// ... or does the creator of the record get some ownership in the account, how much appview purview here?
	// does super user god here, because super user
	relation owner: user | apikey | service | group#member | role#member

	// Group IAM relations
	relation group_iam_adminer: user | apikey | service | space#member | group#member | role#member
	relation group_iam_editor: user | apikey | service | space#member | group#member | role#member
	relation group_iam_lister: user | apikey | service | space#member | group#member | role#member
	relation group_iam_reader: user | apikey | service | space#member | group#member | role#member

	// Group IAM permissions
	permission group_iam_admin = owner + group_iam_adminer + parent->group_iam_admin
	permission group_iam_edit = group_iam_admin + group_iam_editor + parent->group_iam_edit
	permission group_iam_list = group_iam_edit + group_iam_lister + parent->group_iam_list
	permission group_iam_read = group_iam_list + group_iam_reader + parent->group_iam_read
}

definition nsid {
	// space containment / nesting
	relation parent: space

	// every resource gets a default owner of the account the resources live under
	// the owner role can be given to other users or generally subjects too
	// ... or does the creator of the record get some ownership in the account, how much appview purview here?
	// does super user god here, because super user
	relation owner: user | apikey | service | group#member | role#member

	// NSID CRUD relations
	// what about user:* for all logged in users vs anon visitors
	// what about superuser?
	relation nsid_deleter: user | apikey | service | space#member | group#member | role#member
	relation nsid_updater: user | apikey | service | space#member | group#member | role#member
	relation nsid_creater: user | apikey | service | space#member | group#member | role#member
	relation nsid_lister: user | apikey | service | space#member | group#member | role#member | anon
	relation nsid_reader: user | apikey | service | space#member | group#member | role#member | anon

	// NSID CRUD permissions
	permission nsid_delete = owner + nsid_deleter + parent->nsid_delete
	permission nsid_update = nsid_delete + nsid_updater + parent->nsid_update
	permission nsid_create = nsid_update + nsid_creater + parent->nsid_create
	permission nsid_list = nsid_create + nsid_lister + parent->nsid_list
	permission nsid_read = nsid_list + nsid_reader + parent->nsid_read

	// NSID IAM relations
	relation nsid_iam_adminer: user | apikey | service | space#member | group#member | role#member
	relation nsid_iam_editor: user | apikey | service | space#member | group#member | role#member
	relation nsid_iam_lister: user | apikey | service | space#member | group#member | role#member
	relation nsid_iam_reader: user | apikey | service | space#member | group#member | role#member

	// NSID IAM permissions
	permission nsid_iam_admin = owner + nsid_iam_adminer + parent->nsid_iam_admin
	permission nsid_iam_edit = nsid_iam_admin + nsid_iam_editor + parent->nsid_iam_edit
	permission nsid_iam_list = nsid_iam_edit + nsid_iam_lister + parent->nsid_iam_list
	permission nsid_iam_read = nsid_iam_list + nsid_iam_reader + parent->nsid_iam_read
}

definition rpc {
	// space containment / nesting
	relation parent: space

	// every resource gets a default owner of the account the resources live under
	// the owner role can be given to other users or generally subjects too
	// ... or does the creator of the record get some ownership in the account, how much appview purview here?
	// does super user god here, because super user
	relation owner: user | apikey | service | group#member | role#member

	// RPC CRUD relations
	// what about user:* for all logged in users vs anon visitors
	// what about superuser?
	relation rpc_deleter: user | apikey | service | space#member | group#member | role#member
	relation rpc_updater: user | apikey | service | space#member | group#member | role#member
	relation rpc_creater: user | apikey | service | space#member | group#member | role#member
	relation rpc_lister: user | apikey | service | space#member | group#member | role#member | anon
	relation rpc_reader: user | apikey | service | space#member | group#member | role#member | anon

	// RPC CRUD permissions
	permission rpc_delete = owner + rpc_deleter + parent->rpc_delete
	permission rpc_update = rpc_delete + rpc_updater + parent->rpc_update
	permission rpc_create = rpc_update + rpc_creater + parent->rpc_create
	permission rpc_list = rpc_create + rpc_lister + parent->rpc_list
	permission rpc_read = rpc_list + rpc_reader + parent->rpc_read

	// RPC IAM relations
	relation rpc_iam_adminer: user | apikey | service | space#member | group#member | role#member
	relation rpc_iam_editor: user | apikey | service | space#member | group#member | role#member
	relation rpc_iam_lister: user | apikey | service | space#member | group#member | role#member
	relation rpc_iam_reader: user | apikey | service | space#member | group#member | role#member

	// RPC IAM permissions
	permission rpc_iam_admin = owner + rpc_iam_adminer + parent->rpc_iam_admin
	permission rpc_iam_edit = rpc_iam_admin + rpc_iam_editor + parent->rpc_iam_edit
	permission rpc_iam_list = rpc_iam_edit + rpc_iam_lister + parent->rpc_iam_list
	permission rpc_iam_read = rpc_iam_list + rpc_iam_reader + parent->rpc_iam_read
}

definition blob {
	// space containment / nesting
	relation parent: space

	// every resource gets a default owner of the account the resources live under
	// the owner role can be given to other users or generally subjects too
	// ... or does the creator of the record get some ownership in the account, how much appview purview here?
	// does super user god here, because super user
	relation owner: user | apikey | service | group#member | role#member

	// Blob CRUD relations
	// what about user:* for all logged in users vs anon visitors
	// what about superuser?
	relation blob_deleter: user | apikey | service | space#member | group#member | role#member
	relation blob_updater: user | apikey | service | space#member | group#member | role#member
	relation blob_creater: user | apikey | service | space#member | group#member | role#member
	relation blob_lister: user | apikey | service | space#member | group#member | role#member | anon
	relation blob_reader: user | apikey | service | space#member | group#member | role#member | anon

	// Blob CRUD permissions
	permission blob_delete = owner + blob_deleter + parent->blob_delete
	permission blob_update = blob_delete + blob_updater + parent->blob_update
	permission blob_create = blob_update + blob_creater + parent->blob_create
	permission blob_list = blob_create + blob_lister + parent->blob_list
	permission blob_read = blob_list + blob_reader + parent->blob_read

	// Blob IAM relations
	relation blob_iam_adminer: user | apikey | service | space#member | group#member | role#member
	relation blob_iam_editor: user | apikey | service | space#member | group#member | role#member
	relation blob_iam_lister: user | apikey | service | space#member | group#member | role#member
	relation blob_iam_reader: user | apikey | service | space#member | group#member | role#member

	// Blob IAM permissions
	permission blob_iam_admin = owner + blob_iam_adminer + parent->blob_iam_admin
	permission blob_iam_edit = blob_iam_admin + blob_iam_editor + parent->blob_iam_edit
	permission blob_iam_list = blob_iam_edit + blob_iam_lister + parent->blob_iam_list
	permission blob_iam_read = blob_iam_list + blob_iam_reader + parent->blob_iam_read
}

definition record {
	// space containment / nesting
	relation parent: space

	// every resource gets a default owner of the account the resources live under
	// the owner role can be given to other users or generally subjects too
	// ... or does the creator of the record get some ownership in the account, how much appview purview here?
	// does super user god here, because super user
	relation owner: user | apikey | service | group#member | role#member

	// Record CRUD relations
	// what about user:* for all logged in users vs anon visitors
	// what about superuser?
	relation record_deleter: user | apikey | service | space#member | group#member | role#member
	relation record_updater: user | apikey | service | space#member | group#member | role#member
	relation record_creater: user | apikey | service | space#member | group#member | role#member
	relation record_lister: user | apikey | service | space#member | group#member | role#member | anon
	relation record_reader: user | apikey | service | space#member | group#member | role#member | anon

	// Record CRUD permissions
	permission record_delete = owner + record_deleter + parent->record_delete
	permission record_update = record_delete + record_updater + parent->record_update
	permission record_create = record_update + record_creater + parent->record_create
	permission record_list = record_create + record_lister + parent->record_list
	permission record_read = record_list + record_reader + parent->record_read

	// Record IAM relations
	relation record_iam_adminer: user | apikey | service | space#member | group#member | role#member
	relation record_iam_editor: user | apikey | service | space#member | group#member | role#member
	relation record_iam_lister: user | apikey | service | space#member | group#member | role#member
	relation record_iam_reader: user | apikey | service | space#member | group#member | role#member

	// Record IAM permissions
	permission record_iam_admin = owner + record_iam_adminer + parent->record_iam_admin
	permission record_iam_edit = record_iam_admin + record_iam_editor + parent->record_iam_edit
	permission record_iam_list = record_iam_edit + record_iam_lister + parent->record_iam_list
	permission record_iam_read = record_iam_list + record_iam_reader + parent->record_iam_read
}
`;
