
SHELL = /bin/bash
.SHELLFLAGS = -o pipefail -c

.PHONY: help
help: ## Print info about all commands
	@echo "Helper Commands:"
	@echo
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "    \033[01;32m%-20s\033[0m %s\n", $$1, $$2}'
	@echo
	@echo "NOTE: dependencies between commands are not automatic. Eg, you must run 'deps' and 'build' first, and after any changes"

.PHONY: codegen
codegen: ## Re-generate packages from lexicon/ files
	pnpm spacegen
	pnpm codegen
	make -C packages/pds/src/api/com/atproto/space gen

.PHONY: build
build: ## Compile all modules
	pnpm build

.PHONY: test
test: clean-dev-env ## Run all tests
	pnpm test

.PHONY: build-dev-env
build-dev-env: ## Build the "development environment" services
	pnpm dev-env:build

.PHONY: run-dev-env
run-dev-env: clean-dev-env build-dev-env ## Run a "development environment" shell
	cd packages/dev-env; NODE_ENV=development pnpm run start | pnpm exec pino-pretty
# 	cd packages/dev-env; NODE_ENV=development pnpm run start

.PHONY: start-dev-infra
start-dev-infra: ## Stop a "development infrastructure" services
	cd packages/dev-infra; docker compose up -d --wait

.PHONY: stop-dev-infra
stop-dev-infra: ## Stop a "development infrastructure" services
	cd packages/dev-infra; docker compose down

.PHONY: run-dev-env-logged
run-dev-env-logged: clean-dev-env build-dev-env ## Run a "development environment" shell (with logging)
	cd packages/dev-env; LOG_ENABLED=true NODE_ENV=development pnpm run start | pnpm exec pino-pretty

.PHONY: clean-dev-env
clean-dev-env: stop-dev-infra ## Clean up docker containers/volumes used by the "development environment"
	@docker volume rm -f dev-infra_atp_db dev-infra_atp_redis dev-infra_atp_spicedb

.PHONY: sim
sim: ## Run style checks and verify syntax
	cd ./packages/dev-env && ./sim.sh

.PHONY: lint
lint: ## Run style checks and verify syntax
	pnpm verify

.PHONY: fmt
fmt: ## Run syntax re-formatting
	pnpm format

.PHONY: fmt-lexicons
fmt-lexicons: ## Run syntax re-formatting, just on .json files
	pnpm exec eslint ./lexicons/ --ext .json --fix

.PHONY: deps
deps: ## Installs dependent libs using 'pnpm install'
	pnpm install --frozen-lockfile

.PHONY: nvm-setup
nvm-setup: ## Use NVM to install and activate node+pnpm
	nvm install 18
	nvm use 18
	corepack enable

.PHONY: pds-image
pds-image:
	docker build -t blebbit/pds:latest -f ./services/pds/Dockerfile .
