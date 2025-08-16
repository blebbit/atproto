package flexicon

import (
  "github.com/blebbit/atproto/lexicons"
)

methods: { for l, lex in lexicon if lex.defs.main.type != "record" { (l): lex } }

lexicon: {
  //
  // Space
  //

  // record
  space: defs: main: lexicons.#Record & {
    description: "Spaces are nesting sets of groups, roles, content, and their relations."
    key: "any"

    record: properties: shared.tbdProperties
  }

  // embed the default crud
  _spaceCrud: #crud & { #resource: "space" }
  getSpace: _spaceCrud.getSpace
  describeSpace: _spaceCrud.describeSpace
  listSpaces: _spaceCrud.listSpaces
  createSpace: _spaceCrud.createSpace
  updateSpace: _spaceCrud.updateSpace
  deleteSpace: _spaceCrud.deleteSpace

  //
  // Bubble
  //

  // record
  bubble: defs: main: lexicons.#Record & {
    description: "Bubbles are interchangeable with Spaces. They break permission walking to enable more private 'spaces' in a more public 'space', both can be completely private as well."
    key: "any"

    record: properties: shared.tbdProperties
  }

  // embed the default crud
  _bubbleCrud: #crud & { #resource: "bubble" }
  getBubble: _bubbleCrud.getBubble
  describeBubble: _bubbleCrud.describeBubble
  listBubbles: _bubbleCrud.listBubbles
  createBubble: _bubbleCrud.createBubble
  updateBubble: _bubbleCrud.updateBubble
  deleteBubble: _bubbleCrud.deleteBubble


  //
  // Group
  //

  // record
  group: defs: main: lexicons.#Record & {
    description: "Groups are sets of members composed from accounts, services, apikeys, other groups, etc..."
    key: "any"

    record: properties: shared.tbdProperties
  }

  // embed the default crud
  _groupCrud: #crud & { #resource: "group" }
  getGroup: _groupCrud.getGroup
  describeGroup: _groupCrud.describeGroup
  listGroups: _groupCrud.listGroups
  createGroup: _groupCrud.createGroup
  updateGroup: _groupCrud.updateGroup
  deleteGroup: _groupCrud.deleteGroup


  //
  // Role
  //

  // record
  role: defs: main: lexicons.#Record & {
    description: "Roles are a collection of permissions that all members get. They are compositional."
    key: "any"

    record: properties: shared.tbdProperties
  }

  // embed the default crud
  _roleCrud: #crud & { #resource: "role" }
  getRole: _roleCrud.getRole
  describeRole: _roleCrud.describeRole
  listRoles: _roleCrud.listRoles
  createRole: _roleCrud.createRole
  updateRole: _roleCrud.updateRole
  deleteRole: _roleCrud.deleteRole


  //
  // Relation
  //

  // record
  relation: defs: main: lexicons.#Record & {
    description: "A relation tuple [resource, relation, subject]. Subject is acct:<did> whereas the others depend ... Subjects will eventually expand as well"
    key: "any"

    record: {
      properties: {
        subjectType: shared.properties.subjectType
        subject: shared.properties.subject
        permission: shared.properties.permission
        resourceType: shared.properties.resourceType
        resource: shared.properties.resource
        caveats: shared.properties.caveats
        createdAt: shared.properties.createdAt
      }
    }
  }

  // embed the default crud
  _relationCrud: #crud & { #resource: "relation" }
  getRelation: _relationCrud.getRelation
  listRelations: _relationCrud.listRelations
  createRelation: _relationCrud.createRelation
  updateRelation: _relationCrud.updateRelation
  deleteRelation: _relationCrud.deleteRelation

  //
  // Record
  //

  // just embed the default crud
  _recordCrud: #crud & { #resource: "record" }
  // give every record xrpc a collection parameter
  [=~".*Record"]: defs: main: {
    parameters: properties: {
      collection: shared.properties.collection
    }
  }
  getRecord: _recordCrud.getRecord
  listRecords: _recordCrud.listRecords
  createRecord: _recordCrud.createRecord
  updateRecord: _recordCrud.updateRecord
  deleteRecord: _recordCrud.deleteRecord

}
