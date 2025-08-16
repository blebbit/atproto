package validations

discord: #validation & {
  // accounts
  _jay: "acct:jay"
  _paul: "acct:paul"
  _bryan: "acct:bryan"
  _hailey: "acct:hailey"

  // resources
  _root: "space:jay/root"
  _space: "space:jay/discord"
  _bubble: "bubble:jay/discord_private"
  _general: "record:jay/discord/discord_chan/general"
  _moderate: "record:jay/discord/discord_chan/moderate"

  relations: [
    //
    // Discord resources
    //

    // setup discord space
    [_root, "owner", _jay],
    [_space, "parent", _root],

    // groups


    // channels
    [_general, "parent", _space],

    //
    // Discord subjects
    //

    // make others direct members (joined or added)
    [_space, "direct_member", _paul],
    [_space, "direct_member", _bryan],
    [_space, "direct_member", _hailey],


    // give anon list/read (public viewing)
    [_space, "record_viewer", "anon:*"],
    [_space, "record_viewer", "acct:*"], // need to caveat for messages only
    [_space, "blob_getter", "anon:*"],
    [_space, "blob_getter", "acct:*"], // need to caveat for messages only

    // give logins record messages
    [_space, "record_creator", "acct:*"], // need to caveat for messages only

    // joined members can also upload blobs
    [_space, "record_creator", "\(_space)#member"], // need to caveat?
    [_space, "blob_creator", "\(_space)#member"], // need to caveat?

    //
    // Discord moderation
    //

    // bubble in discord space
    [_bubble, "parent", _space],
    // channel in discord bubble
    [_moderate, "parent", _bubble],
    // add mods to bubble
    [_bubble, "direct_member", _hailey],
    // give mods permissions
    [_bubble, "owner", _hailey],
    [_space, "record_adminer", "\(_bubble)#member"],
    [_space, "blob_viewer", "\(_bubble)#member"],
    [_space, "blob_adminer", "\(_bubble)#member"],
    // [_space,"record_creator", "\(bubble)#member"] // create channels

  ]

  asserts: {
    at: [
      // permissions on root space
      [_root, "owners", _jay],
      [_root, "record_get", _jay],

      // permissions on discord space
      [_space, "owners", _jay],
      [_space, "record_get", _jay],
      [_space, "record_get", _paul],
      [_space, "record_get", _bryan],
      [_space, "record_get", _hailey],

      // permissions on discord bubble
      [_bubble, "owners", _jay],
      [_bubble, "record_get", _jay],
      [_bubble, "record_get", _hailey],


      // moderator permissions
      [_space, "record_delete", _jay],
      [_space, "record_delete", _hailey],
    ]

    af: [
      // permissions on root space
      [_root, "record_get", _paul],
      [_root, "record_get", _bryan],
      [_root, "record_get", _hailey],

      // permissions on discord space
      [_space, "record_create", "anon:all"],
      [_space, "record_delete", _paul],

      // permissions on discord bubble
      [_bubble, "record_get", "acct:all"],
      [_bubble, "record_get", "acct:bryan"],
    ]

  }

  // list of subjs and way to permission, no extra or missing allowed
  validate: {
    "\(_space)#owners": [
      [_root, "owner", _jay],
    ]
    "\(_space)#member": [
      [_root, "owner", _jay],
      [_space, "direct_member", _paul],
      [_space, "direct_member", _bryan],
      [_space, "direct_member", _hailey],
    ]
  }
}
