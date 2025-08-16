package flexicon

import (
  "github.com/blebbit/atproto/lexicons"
)

domain_authority: "com.atproto.space"
pds_impl_message: " Requires auth, implemented by PDS."

// apply schema and id to all lexicon
lexicon: [name=string]: LEXI=lexicons.#Lexicon & {
  id: "\(domain_authority).\(name)"

  // need to nest to short-circuit in CUE (tbd if this changes in the future)
  if LEXI.defs.main != _|_ {
    description: LEXI.defs.main.description + pds_impl_message
  }

  // error proxy so we can be compositional
  defs: main: {
    _errors: [string]: string | *""
    errors?: _ | *[for e, d in _errors { "name": e, "description": d }]
  }
}

//
// Reusable values (snippets)
//

shared: {
  tbdProperties: {
    displayName: properties.displayName
    description: properties.description
    avatar: properties.avatar
    banner: properties.banner
    labels: properties.labels
    createdAt: properties.createdAt
  }
  properties: {
    // common lexicon needs
    uri: { type: "string", format: "at-uri" }
    cid: { type: "string", format: "cid" }
    createdAt: { type: "string", format: "datetime" }
    commit: {
      type: "ref"
      ref: "com.atproto.space.defs#commitMeta"
    }
    getCID: cid & {
      description: "The CID of the version of the resource. If not specified, then return the most recent version."
    }
    swapCID: cid & {
      description: "Compare and swap with the previous record by CID."
    }
    returnCID: cid & {
      description: "The CID of the resource."
    }
    validate: {
      type: "boolean"
      description: "Can be set to 'false' to skip Lexicon schema validation of record data, 'true' to require it, or leave unset to validate only for known Lexicons."
    }
    validationStatus: {
      type: "string"
      knownValues: ["valid", "unknown"]
    }

    // at-uri components
    repo: {
      type: "string"
      description: "The handle or DID of the repo (aka, current account)."
      format: "at-identifier"
      maxLength: 256
    }
    space: {
      type: "string"
      format: "record-key"
      maxLength: 64
    }
    spaceSelf: space & {
      description: "The id of the space."
    }
    spaceParent: space & {
      description: "The id of the parent space to nest under. If not set, the current value or /root is assumed. Can be used to move a space or bubble."
    }
    spaceContext: space & {
      description: "The id of the context space to operate under."
    }
    collection: {
      type: "string"
      format: "nsid"
      description: "The NSID of the record type."
      maxLength: 256
    }
    rkey: {
      type: "string"
      description: "The id of the space associated with the repo."
      format: "record-key"
      maxLength: 64
    }
    record: {
      type: "unknown"
      description: "The record itself. Must contain a $type field."
    }
    value: {
      type: "unknown"
      description: "Some value, lexicon and implementation dependent."
    }

    // permissions
    subjectType: lexicons.#String & {
      description: "the subject type [user,group,etc]"
      maxLength: 32
    }
    subject: lexicons.#String & {
      description: "the subject id to grant"
      // limit of at-uri size in this schema
      // size of each component + 3 slashes
      maxLength: 256 + 64 + 256 + 64 + 3
    }
    permission: lexicons.#String & {
      description: "possible values are defined in the spicedb schema and depend on context"
      maxLength: 32
    }
    resourceType: lexicons.#String & {
      description: "The resource type [space,record,etc]"
      maxLength: 32
    }
    resource: lexicons.#String & {
      description: "The object id to assign."
      // limit of at-uri size in this schema
      // size of each component + 4 slashes
      maxLength: 16 + 256 + 64 + 256 + 64 + 4
    }
    caveats: {
      type: "string"
      // TODO, we need to explain these somewhere, the docs / proposal
      description: "nsids: { allowed: map<bool>, default bool, nsid string }"
    }
    zookie: {
      type: "string"
      description: "The Zanzibar/SpiceDB consistency token, very similar in intent to CIDs in ATProto."
    }


    // query parameters
    limit: lexicons.#Integer & {
      minimum: 1
      maximum: int | *100
      default: int | *50
      description: "The number of records to return."
    },
    cursor: lexicons.#String
    reverse: lexicons.#Boolean & {
      description: "Flag to reverse the order of the returned records."
    }

    // profile-y things
    displayName: lexicons.#String & {
      maxGraphemes: 64
      maxLength: 640
    }
    description: lexicons.#String & {
      "description": "Free-form profile description text."
      maxGraphemes: 256
      maxLength: 2560
    }
    avatar: {
      type: "blob"
      description: "Small image to be displayed next to posts from account. AKA, 'profile picture'"
      accept: ["image/png", "image/jpeg"]
      maxSize: 1000000
    }
    banner: {
      type: "blob"
      description: "Larger horizontal image to display behind profile view."
      accept: ["image/png", "image/jpeg"]
      maxSize: 1000000
    }
    labels: {
      type: "union"
      description: "Self-label values, specific to the Bluesky application, on the overall account."
      refs: ["com.atproto.label.defs#selfLabels"]
    }


    //
    // Common returns
    //
    status: {
      type: "string"
      description: "a human readable status message"
    }

    // blob returns
    encoding: lexicons.#String & { maxLength: 64 }
    size:     lexicons.#Integer
  }
}
