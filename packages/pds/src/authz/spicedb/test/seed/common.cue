package seed

import (
  "list"
  "strings"
  "text/template"
)

#header: """
#!/usr/bin/env bash
set -euo pipefail

source $PWD/demo/util/index.sh

"""
#heading: {
  H: string
  O: "\n#\n# \(H)\n#"
}

#common: {
  data: _
  verbose: int | *flags.verbose

  script: strings.Join(list.FlattenN([
    parts,
  ], 1), "\n")

  output: strings.Join(list.FlattenN([
    #header,
    parts,
  ], 1), "\n")


  // create spaces and bubbles
  parts: strings.Join(list.FlattenN([
    [(#template & { H: "seeding self", T: data }).O],
    [for t in data.spaces {
      (#template & { H: "seeding space", T: t }).O
    }],
    [for t in data.bubbles {
      (#template & { H: "seeding bubble", T: t }).O
    }],
    [for t in data.groups {
      (#template & { H: "seeding group", T: t }).O
    }],
    [for t in data.roles {
      (#template & { H: "seeding roles", T: t }).O
    }],
  ], 2), "\n")

  #template: {
    H: string
    T: _
    O: template.Execute(_t, { heading: H, kind: T.$kind, T })
    _t: """
    #
    # {{ .heading}} ({{.id}})
    #
    {{ $T := . -}}

    {{ if eq .kind "account" -}}
    mrun "rooting {{ .id }}" touch '{{ .root }}' owner '{{ .id }}'
    {{ end -}}
    {{ if ne .parent "acct:self" -}}
    mrun 'parenting' touch '{{ .id }}' parent '{{ .parent }}'
    {{ end -}}
    {{ range $t := .members -}}
    mrun "  member {{ $t }}" touch '{{ $T.id }}' direct_member '{{ $t }}'
    {{ end -}}
    {{ range $t := .relns -}}
    mrun '  reln   {{ index $t 1 }}' touch '{{ index $t 0 }}' '{{ index $t 1 }}' '{{ index $t 2 }}' {{ if eq (len $t) 4}} --caveat '{{ index $t 3 }}{{end}}'
    {{ end -}}
    {{ range $t := .perms -}}
    mrun '  perm   {{ index $t 1 }}' touch '{{ $T.id }}' '{{ index $t 0 }}' '{{ index $t 1 }}'
    {{ end -}}
    echo
    """

  }

  ...
}

