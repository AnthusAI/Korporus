.PHONY: help build test test-install clean

IMAGE_NAME := scoring-worker
IMAGE_TAG  := latest
# Build context is always the repo root
REPO_ROOT  := $(shell git -C $(dir $(abspath $(lastword $(MAKEFILE_LIST)))) rev-parse --show-toplevel)

help: ## Show available targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

build: ## Build the container image
	docker build \
		-f $(REPO_ROOT)/services/scoring-worker/Dockerfile \
		-t $(IMAGE_NAME):$(IMAGE_TAG) \
		$(REPO_ROOT)

test-install: ## Install test dependencies into current Python environment
	pip install -r $(REPO_ROOT)/services/scoring-worker/tests/requirements-test.txt

test: ## Run container integration tests (set BUILD=1 to rebuild image first)
	@if [ "$${BUILD:-0}" = "1" ]; then \
		$(MAKE) build; \
	fi
	pytest $(REPO_ROOT)/services/scoring-worker/tests/ -v

clean: ## Remove the local image
	docker rmi $(IMAGE_NAME):$(IMAGE_TAG) 2>/dev/null || true
