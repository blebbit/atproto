package utils

import (
  "strings"
  "text/template"
)

#msg: string

#caveat: {
  nsids?: {
    nsid?: string
    default?: bool
    allowed?: [string]: bool  // int?
  }
}

#relation: [string,string,string] | [string,string,string,string] | [string,string,string,#caveat]

#msgReln: [#msg, #relation]
#msgRelns: [#msg, [...#relation]]

// [ expected]
#checkExpect: "true" | "false" | "caveated"
#check: [#checkExpect, #relation]
#msgCheck: [#msg, #check]
#msgChecks: [#msg, [...#check]]

#freeform: string | #relation | #check
#msgFreeform: [#msg, #freeform]

#zed: "zed --endpoint localhost:50051 --token spicedb --insecure --log-format=console --log-level error"
#ZED: "ZED=\"\(#zed)\""

// this is causing issues for some reason...
#tmplHeader: """
{{ define "relnArgs" -}}
"{{ index . 0 }}" "{{ index . 1 }}" "{{ index . 2 }}" {{ if eq (len .) 4}} --caveat '{{ index . 3 }}'{{end}}
{{- end }}
{{ define "checkArgs" -}}
"{{ index . 0 }}" "{{ index . 1 }}" "{{ index . 2 }}" {{ if eq (len .) 4}} --caveat-context '{{ index . 3 }}'{{end}}
{{- end }}
"""

#bashHeader: """
#!/usr/bin/env bash

\(#ZED)

# used for check and expected results
check() {
  E=$1
  R=$2
  if [[ $R != $E ]]; then
    echo "ERROR: got $R expected $E"
    exit 1
  fi
}

"""


#relationTo: {
  // i/o multi-names
  [string]: {
    i: _
    input: i
    i: input
    o: string
    output: o
    o: output
  }

  spicedbReln: {
    i: string | #relation

    // render with template
    _t: "{{ index . 0 }}#{{ index . 1}}@{{ index . 2}}{{ if eq (len .) 4}}[{{ index . 3}}]{{ end }}"
    t: string | *_t,
    if (i & string) != _|_ {
      o: i
    }
    if (i & string) == _|_ {
      o: strings.TrimSpace(template.Execute(t, i))
    }

    // duplicate for now to confirm consistency
    o: [
      if (i & string) != _|_ { i }
      if (i & [string,string,string]) != _|_ { "\(i[0])#\(i[1])@\(i[2])" }
      if (i & [string,string,string,string]) != _|_ { "\(i[0])#\(i[1])@\(i[2])[\(i[3])]" }
    ][0]
  }

  spicedbCheck: {
    i: string | #relation

    // render with template
    _t: "{{ index . 0 }}#{{ index . 1}}@{{ index . 2}}{{ if eq (len .) 4}} with {{ index . 3}}{{ end }}"
    t: string | *_t,
    if (i & string) != _|_ {
      o: i
    }
    if (i & string) == _|_ {
      o: strings.TrimSpace(template.Execute(t, i))
    }

    // duplicate for now to confirm consistency
    o: [
      if (i & string) != _|_ { i }
      if (i & [string,string,string]) != _|_ { "\(i[0])#\(i[1])@\(i[2])" }
      if (i & [string,string,string,string]) != _|_ { "\(i[0])#\(i[1])@\(i[2]) with \(i[3])" }
    ][0]
  }

  spicedbValidate: {
    i: string | #relation

    // render with template
    _t: "[{{ index . 2 }}{{ if eq (len .) 4}}[...]{{ end }}] is <{{ index . 0 }}#{{ index . 1 }}>"
    t: string | *_t,
    if (i & string) != _|_ {
      o: i
    }
    if (i & string) == _|_ {
      o: strings.TrimSpace(template.Execute(t, i))
    }

    // duplicate for now to confirm consistency
    o: [
      if (i & string) != _|_ { i }
      if (i & [string,string,string]) != _|_ { "[\(i[2])] is <\(i[0])#\(i[1])>" }
      if (i & [string,string,string,string]) != _|_ { "[\(i[2])[...]] is <\(i[0])#\(i[1])>" }
    ][0]
  }

  freeform: {
    i: [#msg, _]
    msg: i[0]
    val: i[1]

    o: [
      if (val & string) != _|_ {
        // echo msg & whatever, run whatever?! (danger)
        "echo \"\(msg) (\(val))\"\n\(val)"
      }

      if (val & #check) != _|_ {
        (check & { "i": i }).o
      }
      if (val & #relation) != _|_ {
        (touch & { "i": i }).o
      }
    ][0]
  }
  freeformMany: {
    i: [...[#msg, _]]
    d: [for x in i { (freeform & { "i": x }).o }]
    o: strings.Join(d, "\n")
  }

  _touchMrun: #"""
  echo "{{ .msg }} ({{ .reln }})"
  $ZED relationship touch {{ template "relnArgs" .reln }} "$@" | grep -v -e '^Last cursor:.*' -e '^Gg.*$'
  """#
  _touchMruns: #"""
  echo "{{ .msg }} (relns: {{ len .reln }})"
  {{ range $r, $reln := .reln -}}
  $ZED relationship touch {{ template "relnArgs" $reln }} "$@" | grep -v -e '^Last cursor:.*' -e '^Gg.*$'
  {{ end }}
  """#
  _touchReln: #"""
  $ZED relationship touch {{ template "relnArgs" . }} "$@" | grep -v -e '^Last cursor:.*' -e '^Gg.*$'
  """#
  touchReln: {
    i: #relation
    t: string | *(#tmplHeader + _touchReln),
    o: strings.TrimSpace(template.Execute(t, i))
  }
  touch: {
    i: #msgReln | #msgRelns
    d: { msg: i[0], reln: i[1]}
    // decide template based on input
    t: string
    if (i & #msgReln) != _|_ {
      t: string | *(#tmplHeader + _touchMrun),
    }
    if (i & #msgRelns) != _|_ {
      t: string | *(#tmplHeader + _touchMruns),
    }
    o: strings.TrimSpace(template.Execute(t, d))
  }
  touchMany: {
    i: [...(#msgReln | #msgRelns)]
    d: [ for x in i { (touch & { "i": x }).o }]
    o: strings.Join(d,"\n")
  }

  _deleteMrun: #"""
  echo "{{ .msg }} ({{ .reln }})"
  $ZED relationship delete {{ template "relnArgs" .reln }} "$@" | grep -v -e '^Last cursor:.*' -e '^Gg.*$'
  """#
  _deleteMruns: #"""
  echo "{{ .msg }} (relns: {{ len .reln }})"
  {{ range $r, $reln := .reln -}}
  $ZED relationship delete {{ template "relnArgs" $reln }} "$@" | grep -v -e '^Last cursor:.*' -e '^Gg.*$'
  {{ end }}
  """#
  _deleteReln: #"""
  $ZED relationship delete {{ template "relnArgs" . }} "$@" | grep -v -e '^Last cursor:.*' -e '^Gg.*$'
  """#
  deleteReln: {
    i: #relation
    t: string | *(#tmplHeader + _deleteReln),
    // o: "dummy"
    o: strings.TrimSpace(template.Execute(t, i))
  }
  delete: {
    i: #msgReln | #msgRelns
    d: { msg: i[0], reln: i[1]}
    // decide template based on input
    t: string
    if (i & #msgReln) != _|_ {
      t: string | *(#tmplHeader + _deleteMrun),
    }
    if (i & #msgRelns) != _|_ {
      t: string | *(#tmplHeader + _deleteMruns),
    }
    o: strings.TrimSpace(template.Execute(t, d))
  }
  deleteMany: {
    i: [...#msgReln]
    d: [ for x in i { (delete & { "i": x }).o }]
    o: strings.Join(d,"\n")
  }

  _checkMrun: #"""
  echo "{{ printf "%-16s" .msg }} = {{ printf "%-8s" .exp }} ? ({{ .reln }}) "
  actual=$($ZED permission check --consistency-full {{ template "checkArgs" .reln }})
  check {{ .exp }} $actual
  """#
  _checkMruns: #"""
  echo "{{ printf "%-16s" .msg }} (checks: {{ len .checks }}) "
  {{ range $c, $check := .check -}}
  actual=$($ZED permission check --consistency-full {{ template "checkArgs" (index $check 1) }})
  check {{ index $check 0 }} $actual
  {{ end }}
  """#
  _checkReln: #"""
  actual=$($ZED permission check --consistency-full {{ template "checkArgs" .reln }})
  check {{ .exp }} $actual
  """#
  checkReln: {
    i: #check
    d: { exp: i[0], reln: i[1]}
    t: string | *(#tmplHeader + _checkReln),
    o: strings.TrimSpace(template.Execute(t, d))
  }
  check: {
    i: #msgCheck | #msgChecks
    d: _
    t: string
    if (i & #msgCheck) != _|_ {
      d: { msg: i[0], exp: i[1][0], reln: i[1][1]}
      t: string | *(#tmplHeader + _checkMrun),
    }
    if (i & #msgChecks) != _|_ {
      d: { msg: i[0], checks: i[1]}
      t: string | *(#tmplHeader + _checkMruns),
    }
    o: strings.TrimSpace(template.Execute(t, d))
  }
  checkMany: {
    i: [...(#msgCheck|#msgChecks)]
    d: [ for x in i { (check & { "i": x }).o }]
    o: strings.Join(d,"\n")
  }
}
