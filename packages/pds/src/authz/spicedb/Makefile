ROOT=$(shell git rev-parse --show-toplevel)

nuke:
	cd $(ROOT); make clean-dev-env

start:
	cd $(ROOT); make start-dev-infra; sleep 6

gen:
	cd schema; zed preview schema compile atproto.zed --out _at.zed

mig: gen
	cd schema; zed --endpoint localhost:50051 --token spicedb --insecure schema write _at.zed

reset: nuke start gen mig

clean:
	cd demo/util; source index.sh; nuke_all_relns

hack:
	cd demo; ./hack.sh


CASES := $(shell cd demo/cases; ls)
cases:
	echo "$(CASES)"
VALID := $(shell cd validations; ls)
valid:
	echo "$(VALID)"

OPTS?=
case/%:
	./demo/cases/_run.sh $(OPTS) $(patsubst case/%,%,$@)

valid/%:
	zed validate ./validations/$(patsubst valid/%,%,$@).yaml
