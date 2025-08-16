ROOT=$(shell git rev-parse --show-toplevel)
LEXD=$(ROOT)/lexicons/com/atproto/space/flexicon
RELP=$(shell grealpath --relative-to="$${PWD}" "$(LEXD)")

gen:
	hof gen

ungen:
	rm -f $$(ls *.ts | grep -v utils.ts)
