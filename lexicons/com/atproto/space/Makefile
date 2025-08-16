
LEXICONS=$(shell cue eval ./flexicon -e 'strings.Join([ for l,_ in lexicon { l } ], "\n")' --out text)

list:
	@cue eval ./flexicon -e 'strings.Join([ for l,_ in lexicon { l } ], "\n")' --out text

GENS=$(addprefix gen/,$(LEXICONS))
gen: $(GENS)
$(GENS):
	@echo generating lexicon.$(@:gen/%=%)
	@cue eval ./flexicon -e 'lexicon.$(@:gen/%=%)' -fo $(@:gen/%=%).json

VIEWS=$(addprefix view/,$(LEXICONS))
view: $(VIEWS)
$(VIEWS):
	cue eval ./flexicon -e 'lexicon.$(@:view/%=%)'
