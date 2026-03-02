.PHONY: codeql-local

LANGS ?= javascript-typescript
NO_FAIL ?= 0

codeql-local:
	@NO_FAIL_FLAG=""; \
	case "$(NO_FAIL)" in 1|true|yes) NO_FAIL_FLAG="--no-fail";; esac; \
	echo "Running CodeQL locally for languages: $(LANGS)"; \
	bash tools/run_codeql_local.sh --lang "$(LANGS)" $$NO_FAIL_FLAG
