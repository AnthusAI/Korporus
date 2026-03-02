.PHONY: help build test test-install clean push publish e2b-workload \
	tf-backend-init tf-backend-apply tf-init-backend tf-plan-local tf-apply-local \
	tf-init tf-plan tf-apply tf-destroy

IMAGE_NAME  := scoring-worker
IMAGE_TAG   := latest
AWS_REGION  := us-west-2
# Build context is always the repo root
REPO_ROOT   := $(shell git -C $(dir $(abspath $(lastword $(MAKEFILE_LIST)))) rev-parse --show-toplevel)
TF_DIR      := $(REPO_ROOT)/infra/scoring-worker
TF_BACKEND_DIR := $(REPO_ROOT)/infra/terraform-backend
# ECR repo URL is read from Terraform state at push time — no hardcoded account ID
ECR_REPO    := $(shell terraform -chdir=$(TF_DIR) output -raw ecr_repository_url 2>/dev/null)
AWS_ACCOUNT_ID := $(shell aws sts get-caller-identity --query Account --output text 2>/dev/null)
TF_STATE_BUCKET ?= korporus-tfstate-$(AWS_ACCOUNT_ID)
TF_STATE_KEY    ?= scoring-worker/terraform.tfstate
TF_LOCK_TABLE   ?= terraform-locks
TF_REGION       ?= $(AWS_REGION)

# ── publish defaults ──────────────────────────────────────────────────────────
# Override on the command line: make publish SCORING_JOB_ID=<uuid> REQUEST_ID=<uuid>
SCORING_JOB_ID ?= $(shell python3 -c "import uuid; print(uuid.uuid4())")
REQUEST_ID     ?= $(shell python3 -c "import uuid; print(uuid.uuid4())")
# Infrastructure IDs (derived from Terraform + AWS CLI — no hard-coding)
_CLUSTER       := $(shell terraform -chdir=$(TF_DIR) output -raw ecs_cluster_name 2>/dev/null)
_SUBNET        := $(shell aws ec2 describe-subnets \
                    --filters "Name=vpc-id,Values=$$(aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text)" \
                    --query "Subnets[0].SubnetId" --output text 2>/dev/null)
_SG            := $(shell aws ec2 describe-security-groups \
                    --filters "Name=group-name,Values=scoring-worker-staging-sg" \
                    --query "SecurityGroups[0].GroupId" --output text 2>/dev/null)
_RABBITMQ_ARN  := $(shell aws secretsmanager describe-secret \
                    --secret-id korporus/scoring-worker/rabbitmq \
                    --query "ARN" --output text 2>/dev/null)
_EXECUTION_ROLE := $(shell terraform -chdir=$(TF_DIR) output -raw execution_role_arn 2>/dev/null)

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

push: ## Build, tag, and push image to ECR (ENV=staging|production, default: staging)
	$(eval ENV ?= staging)
	docker build \
		-f $(REPO_ROOT)/services/scoring-worker/Dockerfile \
		-t $(ECR_REPO):$(ENV) \
		$(REPO_ROOT)
	aws ecr get-login-password --region $(AWS_REGION) | \
		docker login --username AWS --password-stdin $(ECR_REPO)
	docker push $(ECR_REPO):$(ENV)

clean: ## Remove the local image
	docker rmi $(IMAGE_NAME):$(IMAGE_TAG) 2>/dev/null || true

publish: ## Publish a test scoring job to the live RabbitMQ broker (SCORING_JOB_ID=<uuid> REQUEST_ID=<uuid>)
	@echo "Publishing scoring job..."
	@echo "  SCORING_JOB_ID = $(SCORING_JOB_ID)"
	@echo "  REQUEST_ID     = $(REQUEST_ID)"
	@$(REPO_ROOT)/services/scoring-worker/scripts/publish.sh \
		"$(SCORING_JOB_ID)" "$(REQUEST_ID)" "$(_CLUSTER)" "$(_SUBNET)" "$(_SG)" "$(AWS_REGION)" "$(_RABBITMQ_ARN)" "$(_EXECUTION_ROLE)"

e2b-workload: ## Run a sandboxed workload in E2B (requires E2B_API_KEY + TEMPLATE_ID)
	@python $(REPO_ROOT)/services/scoring-worker/scripts/run_e2b_workload.py

# ── Terraform targets ─────────────────────────────────────────────────────────
tf-init: ## Initialize Terraform (download providers)
	terraform -chdir=$(TF_DIR) init

tf-plan: ## Show Terraform execution plan
	terraform -chdir=$(TF_DIR) plan

tf-apply: ## Apply Terraform changes (prompts for confirmation)
	terraform -chdir=$(TF_DIR) apply

tf-destroy: ## Destroy all Terraform-managed resources (prompts for confirmation)
	terraform -chdir=$(TF_DIR) destroy

# ── Terraform backend bootstrap (S3 + DynamoDB) ──────────────────────────────
tf-backend-init: ## Initialize Terraform for backend bootstrap
	terraform -chdir=$(TF_BACKEND_DIR) init

tf-backend-apply: ## Create backend resources (S3 + DynamoDB)
	terraform -chdir=$(TF_BACKEND_DIR) apply \
		-var="state_bucket_name=$(TF_STATE_BUCKET)" \
		-var="lock_table_name=$(TF_LOCK_TABLE)" \
		-var="aws_region=$(TF_REGION)"

tf-init-backend: ## Init scoring-worker with S3 backend + state migration
	terraform -chdir=$(TF_DIR) init \
		-backend-config="bucket=$(TF_STATE_BUCKET)" \
		-backend-config="key=$(TF_STATE_KEY)" \
		-backend-config="region=$(TF_REGION)" \
		-backend-config="dynamodb_table=$(TF_LOCK_TABLE)" \
		-backend-config="encrypt=true"

tf-plan-local: ## Plan using local tfvars (terraform.local.tfvars)
	terraform -chdir=$(TF_DIR) plan -var-file=terraform.local.tfvars

tf-apply-local: ## Apply using local tfvars (terraform.local.tfvars)
	terraform -chdir=$(TF_DIR) apply -var-file=terraform.local.tfvars
