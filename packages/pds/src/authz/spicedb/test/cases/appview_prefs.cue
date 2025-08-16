package cases

import (
  "github.com/blebbit/atproto/packages/pds/src/authz/spicedb/test/utils"
)

case: appview_prefs: utils.#case & {
  _eli: "acct:eli"
  _nat: "acct:nat"
  _app: "service:streamplace"

  _root:  "space:eli/root"
  _space: "space:eli/streamplace"
  _prefs: "bubble:eli/streamplace-prefs"

  relns: {
    seeding: [
      // space setup
      ["  rooting eli", [_root, "owner", _eli]],
      ["  space setup", [_space, "parent", _root]],
      ["  prefs setup", [_prefs, "parent", _space]],
    ]
    access: [
      ["  nat -> space", [_space, "record_creator", _nat]],
      ["  nat -> space", [_space, "record_viewer",  _nat]],
      ["  app -> space", [_space, "record_creator", _app]],
      ["  app -> space", [_space, "record_viewer",  _app]],
      ["  app -> prefs", [_prefs, "record_adminer", _app]],
      ["  app -> prefs", [_prefs, "record_viewer",  _app]],
    ]
  }

  checks: {
    basic: [
      // root checks
      ["  root owners", ["true",  [_root, "owners", _eli]]],
      ["  root owners", ["false", [_root, "owners", _nat]]],
      ["  root owners", ["false", [_root, "owners", _app]]],
      ["  root member", ["true",  [_root, "member", _eli]]],
      ["  root member", ["false", [_root, "member", _nat]]],
      ["  root member", ["false", [_root, "member", _app]]],
      ["  read record", ["true",  [_root, "record_get", _eli]]],
      ["  read record", ["false", [_root, "record_get", _nat]]],
      ["  read record", ["false", [_root, "record_get", _app]]],

      // space checks
      ["  space owners", ["true",  [_space, "owners", _eli]]],
      ["  space owners", ["false", [_space, "owners", _nat]]],
      ["  space owners", ["false", [_space, "owners", _app]]],
      ["  space member", ["true",  [_space, "member", _eli]]],
      ["  space member", ["false", [_space, "member", _nat]]],
      ["  space member", ["false", [_space, "member", _app]]],
      ["  read record ", ["true",  [_space, "record_get", _eli]]],
      ["  read record ", ["true",  [_space, "record_get", _nat]]],
      ["  read record ", ["true",  [_space, "record_get", _app]]],

      // prefs checks
      ["  prefs owners", ["true",  [_prefs, "owners", _eli]]],
      ["  prefs owners", ["false", [_prefs, "owners", _nat]]],
      ["  prefs owners", ["false", [_prefs, "owners", _app]]],
      ["  prefs member", ["true",  [_prefs, "member", _eli]]],
      ["  prefs member", ["false", [_prefs, "member", _nat]]],
      ["  prefs member", ["false", [_prefs, "member", _app]]],
      ["  read record ", ["true",  [_prefs, "record_get", _eli]]],
      ["  read record ", ["false", [_prefs, "record_get", _nat]]],
      ["  read record ", ["true",  [_prefs, "record_get", _app]]],
    ]

    records: [
      ["  nat can make content", ["true",  [_space, "record_create", _nat]]],
      ["  app can make content", ["true",  [_space, "record_create", _app]]],
      ["  app can create prefs", ["true",  [_prefs, "record_create", _app]]],
      ["  nat not create prefs", ["false", [_prefs, "record_create", _nat]]],
    ]
  }

  subcases: {
    default: [
      #"echo "appview_prefs/default - seeding""#,
      (utils.#relationTo.touchMany & { input: relns.seeding }).output,

      #"echo "appview_prefs/default - access""#,
      (utils.#relationTo.touchMany & { input: relns.access }).output,

      #"echo "appview_prefs/default - basic checks""#,
      (utils.#relationTo.checkMany & { input: checks.basic }).output,

      #"echo "appview_prefs/default - record checks""#,
      (utils.#relationTo.checkMany & { input: checks.records }).output,
    ]
  }
}
