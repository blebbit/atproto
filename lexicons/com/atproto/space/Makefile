
LEXICONS=$(shell cue eval ./flexicon -e 'strings.Join([ for l,_ in lexicon { l } ], "\n")' --out text)

list:
	@cue eval ./flexicon -e 'strings.Join([ for l,_ in lexicon { l } ], "\n")' --out text

.PHONY: gen
gen:
	hof gen ./flexicon
