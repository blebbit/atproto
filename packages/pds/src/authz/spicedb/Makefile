ROOT=$(shell git rev-parse --show-toplevel)

nuke:
	cd $(ROOT); make clean-dev-env

start:
	cd $(ROOT); make start-dev-infra; sleep 6

gen:
	cue eval ./schema -e spicedbSchema --out text -fo ./schema/atproto.zed;
	@echo 'export const spicedbSchema = `' > ./schema/atproto.ts;
	@cat ./schema/atproto.zed >> ./schema/atproto.ts;
	@echo '`;' >> ./schema/atproto.ts;


mig: gen
	cd schema; zed --endpoint localhost:50051 --token spicedb --insecure schema write atproto.zed

reset: nuke start gen mig

clean:
	cd test/util; source index.sh; nuke_all_relns

hack:
	cd demo; ./hack.sh

outline:
	@cat schema/atproto.zed | grep \
	  -e "relation parent" \
	  -e "relation owner" \
	  -e "relation direct_member" \
	  -e "^definition"

outline.detailed:
	@cat schema/atproto.zed | grep \
	  -e "relation parent" \
	  -e "relation owner" \
	  -e "relation direct_member" \
	  -e "relation .*_deleter:" \
	  -e "relation .*_lister:" \
	  -e "^definition"


# CASES := $(shell cd demo/cases; ls)
# SEEDS := $(shell cd demo/seeds; ls)
# VALID := $(shell cd validations; ls)

# cases:
# 	echo "$(CASES)"
# seeds:
# 	echo "$(SEEDS)"
# valid:
# 	echo "$(VALID)"

OPTS?=

data/%:
	cue eval ./test/data/*.cue $(OPTS) \
	  -e $(patsubst data/%,%,$@)

seed/%:
	cue export ./test/seed/*.cue $(OPTS) \
		-e seed.$(patsubst seed/%,%,$@).output \
		--out text -t verbose=3 \
		| bash
seed.list:
	cue export ./test/seed/*.cue $(OPTS) \
	  -e 'strings.Join([ for s,_ in seed {s}], "\n")' \
		--out text
seed.list/%:
	cue export ./test/seed/*.cue $(OPTS) \
	  -e 'strings.Join([ for s,_ in seed$(patsubst seed.list/%,.%,$@) {s}], "\n")' \
		--out text
seed.script/%:
	cue export ./test/seed/*.cue $(OPTS) \
		-e seed.$(patsubst seed.script/%,%,$@).output \
		--out text -t verbose=3
seed.view/%:
	@cue eval ./test/seed/*.cue $(OPTS) \
		-e $(patsubst seed.view/%,%,$@)
seed.flags:
	@cue eval ./test/seed/*.cue $(OPTS) -e flags

case.list:
	cue export ./test/cases/*.cue $(OPTS) \
	  -e 'strings.Join([ for s,_ in case {s}],"\n")' \
		--out text
case.list/%:
	cue export ./test/cases/*.cue $(OPTS) \
	  -e 'strings.Join([ for s,_ in case$(patsubst case.list/%,.%,$@) {s}],"\n")' \
		--out text
case/%:
	cue export ./test/cases/*.cue $(OPTS) \
		-e case.$(patsubst case/%,%,$@).output \
		--out text -t verbose=3 \
		| bash
case.script/%:
	@cue export ./test/cases/*.cue $(OPTS) \
		-e case.$(patsubst case.script/%,%,$@).output \
		--out text -t verbose=3
case.view/%:
	cue eval ./test/cases/*.cue $(OPTS) \
		-e case.$(patsubst case.view/%,%,$@) --out json
case.flags:
	@cue eval ./test/cases/*.cue $(OPTS) -e flags


hack/%:
	cue export ./validations/*.cue $(OPTS) \
	  -e $(patsubst hack/%,%,$@).output \
		-fo ./validations/tmp.yaml \
		&& zed validate ./validations/tmp.yaml
validate/%:
	cue export ./validations/*.cue $(OPTS) \
	  -e $(patsubst validate/%,%,$@).output --out json \
	| cue export json: - -fo ./validations/tmp.yaml \
		&& zed validate ./validations/tmp.yaml
validate.view/%:
	cue export ./validations/*.cue $(OPTS) \
	  -e $(patsubst validate.view/%,%,$@)
validate.output/%:
	cue export ./validations/*.cue $(OPTS) \
	  -e $(patsubst validate.output/%,%,$@).output
validate.yaml/%:
	cue export ./validations/*.cue $(OPTS) \
	  -e $(patsubst validate.yaml/%,%,$@).output --out json \
	| cue export json: - --out yaml
