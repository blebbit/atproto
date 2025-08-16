package flexicon

import (
  "github.com/blebbit/atproto/lexicons"
)

lexicon: {

  checkPermission: defs: main: lexicons.#Query & {
    description: "Check if the permission is allowed."

    parameters: {
      required: ["resourceType", "resource", "permission", "subjectType", "subject"]
      properties: {
        resourceType: shared.properties.resourceType
        resource: shared.properties.resource
        permission: shared.properties.permission
        subjectType: shared.properties.subjectType
        subject: shared.properties.subject
        caveats: shared.properties.caveats
        zookie: shared.properties.zookie
      }
    }

    output: schema: {
      required: ["allowed"]
      properties: {
        allowed: lexicons.#String & {
          description: "one of: [yes,no,conditional,unspecified,unknown]"
        }
      }
    }
  }

  checkPermissions: defs: main: lexicons.#Query & {
    description: "Bulk check if the permission is allowed."

    parameters: {
      required: ["resourceType", "resources", "permission", "subjectType", "subject"]
      properties: {
        resourceType: shared.properties.resourceType
        resources: lexicons.#Array & {
          description: "List of object ids to see if subject is granted the permission.",
          items: lexicons.#String
        }
        permission: shared.properties.permission
        subjectType: shared.properties.subjectType
        subject: shared.properties.subject
        caveats: shared.properties.caveats
        zookie: shared.properties.zookie
      }
    }

    output: schema: {
      required: ["allowed"]
      properties: {
        allowed: lexicons.#Array & {
          description: "List ordered the same as input objects, with allowed status.",
          items: lexicons.#String & {
            description: "one of: [yes,no,conditional,unspecified,unknown]"
          }
        }
      }
    }
  }


  lookupResources: defs: main: lexicons.#Query & {
    description: "List of resource for the given permission for the given subject."

    parameters: {
      required: ["permission", "subjectType", "subject"]
      properties: {
        resourceType: shared.properties.resourceType
        resource: shared.properties.resource
        permission: shared.properties.permission
        subjectType: shared.properties.subjectType
        subject: shared.properties.subject
        caveats: shared.properties.caveats
        zookie: shared.properties.zookie
      }
    }

    output: schema: {
      required: ["resources"]
      properties: {
        resources: lexicons.#Array & {
          description: "List of all the resources the subject has the given permission.",
          items: lexicons.#String & {
            description: "subject ids"
          }
        }
      }
    }
  }

  lookupSubjects: defs: main: lexicons.#Query & {
    description: "List of subjects with the given permission over the resource."

    parameters: {
      required: ["resourceType", "resource", "permission"]
      properties: {
        resourceType: shared.properties.resourceType
        resource: shared.properties.resource
        permission: shared.properties.permission
        subjectType: shared.properties.subjectType
        subject: shared.properties.subject
        caveats: shared.properties.caveats
        zookie: shared.properties.zookie
      }
    }

    output: schema: {
      required: ["subjects"]
      properties: {
        subjects: lexicons.#Array & {
          description: "List of all the subjects that have the given permission on the object.",
          items: lexicons.#String & {
            description: "subject ids"
          }
        }
      }
    }
  }

}
