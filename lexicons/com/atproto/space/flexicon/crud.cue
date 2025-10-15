package flexicon

import (
  "strings"

  "github.com/blebbit/atproto/lexicons"
)

#crud: {
  ...

  #resource: string
  let resource = #resource
  let resources = resource + "s"
  let Resource = strings.ToTitle(resource)
  let Resources = Resource + "s"

  "get\(Resource)": {
    defs: main: lexicons.#Query & {
      description: "Get a \(resource) from a repository."
      auth: {
        permission: "get_\(resource)"
        objectType: string | *"\(resource)"
      }

      parameters: {
        required: ["repo", "rkey"]
        properties: {
          repo: shared.properties.repo
          parent: shared.properties.spaceContext
          rkey: shared.properties.spaceSelf
          cid: shared.properties.getCID
          zookie: shared.properties.zookie
        }
      }

      output: schema: {
        required: ["uri", "value"]
        properties: {
          uri: shared.properties.uri
          cid: shared.properties.returnCID
          value: shared.properties.value
        }
      }

      _errors: {
        "\(Resource)NotFound": "unknown \(resource) or insufficient permissions"
      }
    }
  }

  "describe\(Resource)": defs: {
    main: lexicons.#Query & {
      description: "Get a \(resource) from a repository with extra information."
      auth: {
        permission: "get_\(resource)"
        objectType: string | *"\(resource)"
      }

      parameters: {
        required: ["repo", "rkey"]
        properties: {
          repo: shared.properties.repo
          parent: shared.properties.spaceContext
          rkey: shared.properties.spaceSelf
          cid: shared.properties.getCID
          zookie: shared.properties.zookie
        }
      }

      output: schema: {
        required: ["uri", "value"]
        properties: {
          uri: shared.properties.uri
          cid: shared.properties.returnCID
          value: shared.properties.value
        }
      }
    }
  }

  "list\(Resources)": defs: {
    main: lexicons.#Query & {
      description: "List \(resources) under a repository."
      auth: {
        permission: "list_\(resource)"
        objectType: string | *"space"
      }

      parameters: {
        required: ["repo"]
        properties: {
          repo: shared.properties.repo
          parent: shared.properties.spaceContext
          limit: shared.properties.limit
          cursor: shared.properties.cursor
          reverse: shared.properties.reverse
          zookie: shared.properties.zookie
        }
      }

      output: schema: {
        required: [resources]
        properties: {
          cursor: shared.properties.cursor
          (resources): lexicons.#Array & { items: lexicons.#Ref & { ref: "#record" }}
        }
      }

      _errors: {
        RecordNotFound: "unknown space or insufficient permissions"
      }
    }

    record: lexicons.#Object & {
      required: ["uri", "cid", "value"]
      properties: {
        uri: shared.properties.uri
        cid: shared.properties.returnCID
        value: shared.properties.value
      }
    }
  }

  "create\(Resource)": defs: {
    main: lexicons.#Procedure & {
      description: "Create a new repository \(resource), errors if it exists."
      auth: {
        permission: "create_\(resource)"
        objectType: string | *"space"
      }

      input: schema: {
        required: ["repo", "record"]
        properties: {
          repo: shared.properties.repo
          parent: shared.properties.spaceParent
          rkey: shared.properties.rkey
          record: shared.properties.record
          validate: shared.properties.validate
          zookie: shared.properties.zookie
        }
      }

      output: schema: {
        required: ["uri", "cid"]
        properties: {
          uri: shared.properties.uri
          cid: shared.properties.cid
          zookie: shared.properties.zookie
          validationStatus: shared.properties.validationStatus
          status: shared.properties.status
        }
      }
    }
  }

  "update\(Resource)": defs: {
    main: lexicons.#Procedure & {
      description: "Update an existing \(resource), errors if it does not exist.",
      auth: {
        permission: "update_\(resource)"
        objectType: string | *"\(resource)"
      }

      input: schema: {
        required: ["repo", "rkey", "record"]
        properties: {
          repo: shared.properties.repo
          parent: shared.properties.spaceParent
          rkey: shared.properties.spaceSelf
          record: shared.properties.record
          validate: shared.properties.validate
          swapCID: shared.properties.swapCID
          zookie: shared.properties.zookie
        }
      }

      output: schema: {
        properties: {
          uri: shared.properties.uri
          cid: shared.properties.cid
          zookie: shared.properties.zookie
          validationStatus: shared.properties.validationStatus
          status: shared.properties.status
        }
      }

      _errors: {
        RecordNotFound: "unknown \(resource) or insufficient permissions"
        InvalidSwap: "provided swapCID did not match CID found in database"
      }
    }
  }

  "delete\(Resource)": defs: {
    main: lexicons.#Procedure & {
      description: "Delete a \(resource) and everything associated with it.",
      auth: {
        permission: "delete_\(resource)"
        objectType: string | *"\(resource)"
      }

      input: schema: {
        required: ["repo", "rkey"]
        properties: {
          repo: shared.properties.repo
          rkey: shared.properties.space
          swapCID: shared.properties.swapCID
          zookie: shared.properties.zookie
        }
      }

      output: schema: {
        properties: {
          status: shared.properties.status
          zookie: shared.properties.zookie
        }
      }

      _errors: {
        RecordNotFound: "unknown \(resource) or insufficient permissions"
        InvalidSwap: "provided swapCID did not match CID found in database"
      }
    }
  }
}
