export const spicedbSchema = `
// 
// Subjects
// 
// not all are used yet
definition anon {}

definition user {}

definition apikey {}

definition service {}

definition svcacct {}

definition superuser {}

// 
// TODO - custom roles
// 
// we need a way for everyone to define reusable sets of permissions
// much like we do for oauth scopes today with permission sets (name?)
// 
// 
// ALSO - caveats and conditions
// is this a better way to handle nsids / collections?
// we probably (maybe) want to expose them for services
// 
// 
// Resources
// 
// groups are orthogonal to content
definition group {
	// pseudo member role as a permission
	permission member = owner + creater + updater + deleter + lister + reader + iam_admin + iam_editor + iam_lister + iam_reader

	// every resource gets a default owner of the account the resources live under
	// the owner role can be given to other users or generally subjects too
	relation owner: user | apikey | service | svcacct | group#member

	// (optional) space containment / nesting
	relation parent: space

	// CRUD relations
	relation deleter: user | apikey | service | svcacct | group#member
	relation updater: user | apikey | service | svcacct | group#member
	relation creater: user | apikey | service | svcacct | group#member
	relation lister: user | apikey | service | svcacct | group#member | anon
	relation reader: user | apikey | service | svcacct | group#member | anon

	// what about user:* for all logged in users vs anon visitors
	// same for other subject kinds?
	// what about superuser?
	// IAM relations
	relation iam_adminer: user | apikey | service | svcacct | group#member
	relation iam_editor: user | apikey | service | svcacct | group#member
	relation iam_lister: user | apikey | service | svcacct | group#member
	relation iam_reader: user | apikey | service | svcacct | group#member

	// Permissions cascade within the rules per section
	// CRUD permissions
	permission delete = owner + deleter + parent->delete
	permission update = delete + updater + parent->update
	permission create = update + creater + parent->create
	permission list = create + lister + parent->list
	permission read = list + reader + parent->read

	// IAM permissions
	permission iam_admin = owner + iam_adminer + parent->iam_admin
	permission iam_edit = iam_admin + iam_editor + parent->iam_edit
	permission iam_list = iam_edit + iam_lister + parent->iam_list
	permission iam_read = iam_list + iam_reader + parent->iam_read
}

// the content resources form a hierarchy
definition space {
	// every resource gets a default owner of the account the resources live under
	// the owner role can be given to other users or generally subjects too
	relation owner: user | apikey | service | svcacct | group#member

	// (optional) space containment / nesting
	relation parent: space

	// CRUD relations
	relation deleter: user | apikey | service | svcacct | group#member
	relation updater: user | apikey | service | svcacct | group#member
	relation creater: user | apikey | service | svcacct | group#member
	relation lister: user | apikey | service | svcacct | group#member | anon
	relation reader: user | apikey | service | svcacct | group#member | anon

	// what about user:* for all logged in users vs anon visitors
	// same for other subject kinds?
	// what about superuser?
	// IAM relations
	relation iam_adminer: user | apikey | service | svcacct | group#member
	relation iam_editor: user | apikey | service | svcacct | group#member
	relation iam_lister: user | apikey | service | svcacct | group#member
	relation iam_reader: user | apikey | service | svcacct | group#member

	// Permissions cascade within the rules per section
	// CRUD permissions
	permission delete = owner + deleter + parent->delete
	permission update = delete + updater + parent->update
	permission create = update + creater + parent->create
	permission list = create + lister + parent->list
	permission read = list + reader + parent->read

	// IAM permissions
	permission iam_admin = owner + iam_adminer + parent->iam_admin
	permission iam_edit = iam_admin + iam_editor + parent->iam_edit
	permission iam_list = iam_edit + iam_lister + parent->iam_list
	permission iam_read = iam_list + iam_reader + parent->iam_read
}

definition collection {
	// every resource gets a default owner of the account the resources live under
	// the owner role can be given to other users or generally subjects too
	relation owner: user | apikey | service | svcacct | group#member

	// (optional) space containment / nesting
	relation parent: space

	// CRUD relations
	relation deleter: user | apikey | service | svcacct | group#member
	relation updater: user | apikey | service | svcacct | group#member
	relation creater: user | apikey | service | svcacct | group#member
	relation lister: user | apikey | service | svcacct | group#member | anon
	relation reader: user | apikey | service | svcacct | group#member | anon

	// what about user:* for all logged in users vs anon visitors
	// same for other subject kinds?
	// what about superuser?
	// IAM relations
	relation iam_adminer: user | apikey | service | svcacct | group#member
	relation iam_editor: user | apikey | service | svcacct | group#member
	relation iam_lister: user | apikey | service | svcacct | group#member
	relation iam_reader: user | apikey | service | svcacct | group#member

	// Permissions cascade within the rules per section
	// CRUD permissions
	permission delete = owner + deleter + parent->delete
	permission update = delete + updater + parent->update
	permission create = update + creater + parent->create
	permission list = create + lister + parent->list
	permission read = list + reader + parent->read

	// IAM permissions
	permission iam_admin = owner + iam_adminer + parent->iam_admin
	permission iam_edit = iam_admin + iam_editor + parent->iam_edit
	permission iam_list = iam_edit + iam_lister + parent->iam_list
	permission iam_read = iam_list + iam_reader + parent->iam_read
}

definition record {
	// every resource gets a default owner of the account the resources live under
	// the owner role can be given to other users or generally subjects too
	relation owner: user | apikey | service | svcacct | group#member

	// (optional) space containment / nesting
	relation parent: space

	// CRUD relations
	relation deleter: user | apikey | service | svcacct | group#member
	relation updater: user | apikey | service | svcacct | group#member
	relation creater: user | apikey | service | svcacct | group#member
	relation lister: user | apikey | service | svcacct | group#member | anon
	relation reader: user | apikey | service | svcacct | group#member | anon

	// what about user:* for all logged in users vs anon visitors
	// same for other subject kinds?
	// what about superuser?
	// IAM relations
	relation iam_adminer: user | apikey | service | svcacct | group#member
	relation iam_editor: user | apikey | service | svcacct | group#member
	relation iam_lister: user | apikey | service | svcacct | group#member
	relation iam_reader: user | apikey | service | svcacct | group#member

	// Permissions cascade within the rules per section
	// CRUD permissions
	permission delete = owner + deleter + parent->delete
	permission update = delete + updater + parent->update
	permission create = update + creater + parent->create
	permission list = create + lister + parent->list
	permission read = list + reader + parent->read

	// IAM permissions
	permission iam_admin = owner + iam_adminer + parent->iam_admin
	permission iam_edit = iam_admin + iam_editor + parent->iam_edit
	permission iam_list = iam_edit + iam_lister + parent->iam_list
	permission iam_read = iam_list + iam_reader + parent->iam_read
}

definition blob {
	// every resource gets a default owner of the account the resources live under
	// the owner role can be given to other users or generally subjects too
	relation owner: user | apikey | service | svcacct | group#member

	// (optional) space containment / nesting
	relation parent: space

	// CRUD relations
	relation deleter: user | apikey | service | svcacct | group#member
	relation updater: user | apikey | service | svcacct | group#member
	relation creater: user | apikey | service | svcacct | group#member
	relation lister: user | apikey | service | svcacct | group#member | anon
	relation reader: user | apikey | service | svcacct | group#member | anon

	// what about user:* for all logged in users vs anon visitors
	// same for other subject kinds?
	// what about superuser?
	// IAM relations
	relation iam_adminer: user | apikey | service | svcacct | group#member
	relation iam_editor: user | apikey | service | svcacct | group#member
	relation iam_lister: user | apikey | service | svcacct | group#member
	relation iam_reader: user | apikey | service | svcacct | group#member

	// Permissions cascade within the rules per section
	// CRUD permissions
	permission delete = owner + deleter + parent->delete
	permission update = delete + updater + parent->update
	permission create = update + creater + parent->create
	permission list = create + lister + parent->list
	permission read = list + reader + parent->read

	// IAM permissions
	permission iam_admin = owner + iam_adminer + parent->iam_admin
	permission iam_edit = iam_admin + iam_editor + parent->iam_edit
	permission iam_list = iam_edit + iam_lister + parent->iam_list
	permission iam_read = iam_list + iam_reader + parent->iam_read
}
`;
