package flexicon

import (
  "github.com/blebbit/atproto/lexicons"
)

lexicon: getBlob: {
  defs: main: lexicons.#Query & {
    description: "Get a blob from a repository."
    auth: permission: "get_blob"

    parameters: {
      required: ["repo", "cid"]
      properties: {
        repo: shared.properties.repo
        space: shared.properties.spaceSelf
        parent: shared.properties.spaceContext
        cid: shared.properties.getCID
      }
    }

    output: encoding: "*/*"

    _errors: {
      BlobNotFound: "unknown blob or insufficient permissions"
      RepoNotFound: ""
      RepoTakendown: ""
      RepoSuspended: ""
      RepoDeactivated: ""
    }
  }
}

lexicon: listBlobs: {
  defs: main: lexicons.#Query & {
    description: "List blobs under a repository."
    auth: permission: "list_blob"

    parameters: {
      required: ["repo"]
      properties: {
        repo: shared.properties.repo
        parent: shared.properties.spaceContext
        limit: shared.properties.limit & { maximum: 1000, default: 500 }
        cursor: shared.properties.cursor
        reverse: shared.properties.reverse
        since: {
          type: "string"
          description: "Optional revision of the repo to list blobs since. (note, createdAt?)"
        }
      }
    }

    output: schema: {
      required: ["blobs"]
      properties: {
        cursor: shared.properties.cursor
        blobs: lexicons.#Array & { items: lexicons.#Ref & { ref: "#record" }}
      }
    }

    _errors: {
      RepoNotFound: ""
      RepoTakendown: ""
      RepoSuspended: ""
      RepoDeactivated: ""
    }
  }

  defs: record: lexicons.#Object & {
    required: ["uri", "cid"]
    properties: {
      uri: shared.properties.uri
      cid: shared.properties.returnCID
      encoding: shared.properties.encoding
      size: shared.properties.size
    }
  }
}

lexicon: uploadBlob: {
  defs: main: lexicons.#Procedure & {
    description: "Upload a new blob, to be referenced from a repository record. The blob will be deleted if it is not referenced within a time window (eg, minutes). Blob restrictions (mimetype, size, etc) are enforced when the reference is created."
    auth: permission: "create_blob"

    parameters: {
      required: ["repo", "space"]
      properties: {
        repo: shared.properties.repo
        space: shared.properties.spaceContext
      }
    }

    input: encoding: "*/*"

    output: schema: {
      required: ["uri", "cid"]
      properties: {
        uri: shared.properties.uri
        cid: shared.properties.cid
        validationStatus: shared.properties.validationStatus
        status: shared.properties.status
      }
    }
  }
}

lexicon: deleteBlob: {
  defs: main: lexicons.#Query & {
    description: "Delete a blob from a repository."
    auth: permission: "get_blob"

    parameters: {
      required: ["repo", "cid"]
      properties: {
        repo: shared.properties.repo
        space: shared.properties.spaceSelf
        parent: shared.properties.spaceContext
        cid: shared.properties.getCID
      }
    }

    output: schema: {
      properties: {
        status: shared.properties.status
      }
    }

    _errors: {
      BlobNotFound: "unknown blob or insufficient permissions"
      RepoNotFound: ""
      RepoTakendown: ""
      RepoSuspended: ""
      RepoDeactivated: ""
    }
  }
}

lexicon: listMissingBlobs: {
  defs: main: lexicons.#Query & {
    description: "Returns a list of missing blobs for the requesting account. Intended to be used in the account migration flow.",
    auth: permission: "list_blob"

    parameters: {
      required: ["repo"]
      properties: {
        repo: shared.properties.repo
        parent: shared.properties.spaceContext
        limit: shared.properties.limit & { maximum: 1000, default: 500 }
        cursor: shared.properties.cursor
        reverse: shared.properties.reverse
        since: {
          type: "string"
          description: "Optional revision of the repo to list blobs since. (note, createdAt?)"
        }
      }
    }

    output: schema: {
      required: ["blobs"]
      properties: {
        cursor: shared.properties.cursor
        blobs: lexicons.#Array & { items: lexicons.#Ref & { ref: "#recordBlob" }}
      }
    }

    _errors: {
      RepoNotFound: ""
      RepoTakendown: ""
      RepoSuspended: ""
      RepoDeactivated: ""
    }
  }

  defs: recordBlob: lexicons.#Object & {
    required: ["cid", "recordUri"]
    properties: {
      cid:       lexicons.#CID
      recordUri: lexicons.#AtURI
    }
  }
}
