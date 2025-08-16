import { AppContext } from '../../../../context'
import { Server } from '../../../../lexicon'

{{ range $l, $lex := .LEXICONS -}}
{{ $name := (trimprefix $lex.id "com.atproto.space.") -}}
{{ if (ne "record" $lex.defs.main.type) -}}
import {{ $name }} from './{{ $name }}'
{{ end -}}
{{ end }}

export default function (server: Server, ctx: AppContext) {
{{ range $l, $lex := .LEXICONS -}}
{{ $name := (trimprefix $lex.id "com.atproto.space.") -}}
{{ if (ne "record" $lex.defs.main.type) -}}
{{ $name }}(server, ctx)
{{ end -}}
{{ end }}

}
