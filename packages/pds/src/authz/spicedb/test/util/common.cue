package util

import (
  "strings"
  "text/template"
)

#caveat: {
  nsids?: {
    nsid?: string
    allowed?: [...string]
  }
}
#relation: string | [string,string,string] | [string,string,string,string] | [string,string,string,#caveat]
#msgReln: [string, #relation]
#check: #relation
#msgCheck: [string, string, #check]

#zed: "zed --endpoint localhost:50051 --token spicedb --insecure --log-format=console --log-level error"
#ZED: "ZED=\"\(#zed)\""

#bashHeader: """
#!/usr/bin/env bash

\(#ZED)

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
    i: #relation

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
    i: #check

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
    i: #check

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

  _touchMrun: #"""
  echo "{{ .msg }} ({{ .reln }})"
  $ZED relationship touch "{{ index .reln 0 }}" "{{ index .reln 1 }}" "{{ index .reln 2 }}" {{ if eq (len .reln) 4}} --caveat '{{ index .reln 3 }}'{{end}} \
  "$@" | grep -v -e '^Last cursor:.*' -e '^Gg.*$'
  """#
  touch: {
    i: #msgReln
    d: { msg: i[0], reln: i[1]}
    t: string | *_touchMrun,
    o: strings.TrimSpace(template.Execute(t, d))
  }
  touchMany: {
    i: [...#msgReln]
    d: [ for x in i { msg: x[0], reln: x[1]}]
    t: string | *"""
    {{ range . }}\(_touchMrun)
    {{ end }}
    """
    o: strings.TrimSpace(template.Execute(t, d))
  }

  _checkMrun: #"""
  echo "{{ .msg }} = {{ .exp}} ? ({{ .reln }}) "
  actual=$($ZED permission check --consistency-full "{{ index .reln 0 }}" "{{ index .reln 1 }}" "{{ index .reln 2 }}" {{ if eq (len .reln) 4}} --caveat-context '{{ index .reln 3 }}'{{end}})
  check {{ .exp }} $actual
  """#
  check: {
    i: #msgCheck
    d: { msg: i[0], exp: i[1], reln: i[2]}
    t: string | *_checkMrun,
    o: strings.TrimSpace(template.Execute(t, d))
  }
  checkMany: {
    i: [...#msgCheck]
    d: [ for x in i { msg: x[0], exp: x[1], reln: x[2]}]
    t: string | *"""
    {{ range . }}\(_checkMrun)
    {{ end }}
    """
    o: strings.TrimSpace(template.Execute(t, d))
  }
}
