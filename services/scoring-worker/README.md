# Scoring Worker Container

Portable, long-lived asynchronous scoring worker. Runs the Plexus scoring stack in a generic container runtime with no AWS Lambda dependency.

## Status

**Phase 2 complete.** The container starts, validates required configuration, connects to RabbitMQ, and runs a long-lived consumer loop for scoring requests. The RabbitMQ request/response flow is covered by container tests and an end-to-end RabbitMQ integration test.

## Architecture

```
services/scoring-worker/
├── Dockerfile                    # Production-hardened image (python:3.11-slim, non-root user, healthcheck)
├── Makefile                      # build / test / test-install / clean
├── docker-compose.yml            # Local dev: RabbitMQ + worker
├── requirements.txt              # Minimal runtime deps (aio-pika + plexus from git)
├── worker.py                     # Long-lived worker entrypoint + RabbitMQ consumer
└── tests/
    ├── requirements-test.txt     # pytest + testcontainers (core + rabbitmq)
    ├── test_worker_container.py  # Container integration tests (startup/validation)
    └── test_worker_rabbitmq.py   # RabbitMQ request/response integration tests
```

## What the worker does right now

Starts up, validates required environment variables, connects to RabbitMQ, and consumes scoring requests. On success it publishes a response with the same `request_id` and `status="success"`; on failure it logs the error with `request_id` and rejects the message without requeue. A mock scoring mode is available for local/dev testing without a live backend.

## Transport

RabbitMQ provides the request/response messaging layer. The worker consumes requests, executes scoring, and publishes a success response with the same `request_id`.

## Health endpoints

The worker exposes HTTP endpoints for orchestration:

- `GET /healthz` or `GET /livez` → `200` when the process is running
- `GET /readyz` → `200` when RabbitMQ is connected, `503` otherwise

Configuration:

| Variable | Description |
|---|---|
| `PLEXUS_HEALTH_HOST` | Bind host (default: `0.0.0.0`) |
| `PLEXUS_HEALTH_PORT` | Bind port (default: `8080`) |

### Request message schema

```json
{
  "request_id": "req-123",
  "scoring_job_id": "job-456"
}
```

### Response message schema

```json
{
  "request_id": "req-123",
  "status": "success",
  "value": "PASS",
  "explanation": "Reasoning/explanation text...",
  "cost": {"prompt_tokens": 2015, "completion_tokens": 2, "total_tokens": 2017, "llm_calls": 2, "cached_tokens": 0, "input_cost": 0.00030225, "output_cost": 1.2e-06, "total_cost": 0.00030345}
}
```

## Required environment variables

| Variable | Description |
|---|---|
| `PLEXUS_ACCOUNT_KEY` | Plexus account key |
| `PLEXUS_API_KEY` | Plexus API key |
| `PLEXUS_API_URL` | Plexus GraphQL API URL |
| `PLEXUS_LANGGRAPH_CHECKPOINTER_POSTGRES_URI` | PostgreSQL URI for LangGraph checkpointer |
| `PLEXUS_RABBITMQ_URL` | RabbitMQ AMQP URL (e.g. `amqp://user:pass@host:5672/`) |
| `PLEXUS_RABBITMQ_REQUEST_QUEUE` | Queue name for scoring requests |
| `PLEXUS_RABBITMQ_RESPONSE_QUEUE` | Queue name for scoring responses |
| `PLEXUS_FETCH_SCHEMA_FROM_TRANSPORT` | `false` to skip GraphQL schema introspection (needed for some AppSync endpoints) |

Optional:

| Variable | Description |
|---|---|
| `PLEXUS_RABBITMQ_PREFETCH` | Prefetch count (default: 1) |
| `PLEXUS_SCORING_MODE` | `real` or `mock` (default: `real`) |

E2B workload demo (optional):

| Variable | Description |
|---|---|
| `E2B_API_KEY` | E2B team API key |
| `TEMPLATE_ID` | E2B template ID |
| `E2B_DOMAIN` | E2B domain (default: `e2b.korpor.us`) |

## Build and run

Build context must be the repo root:

```bash
# From repo root
docker build -f services/scoring-worker/Dockerfile -t scoring-worker .

# Run (will exit 1 immediately without required env vars)
docker run --rm \
  -e PLEXUS_ACCOUNT_KEY=... \
  -e PLEXUS_API_KEY=... \
  -e PLEXUS_API_URL=... \
  -e PLEXUS_LANGGRAPH_CHECKPOINTER_POSTGRES_URI=... \
  scoring-worker
```

Or via Makefile (also from repo root):

```bash
make -f services/scoring-worker/Makefile build
make -f services/scoring-worker/Makefile test
```

## Run a sandboxed workload (E2B)

From the repo root, this will create a sandbox, run a Python workload, print output,
then clean up:

```bash
E2B_API_KEY=... TEMPLATE_ID=... \
make -f services/scoring-worker/Makefile e2b-workload
```

## Terraform

Terraform lives in `infra/scoring-worker`. We bootstrap an S3 backend +
DynamoDB lock table first, then run the scoring-worker stack with a local
tfvars file for RabbitMQ credentials.

### Backend bootstrap (one-time)

```bash
# Create S3 + DynamoDB backend
make -f services/scoring-worker/Makefile tf-backend-init
make -f services/scoring-worker/Makefile tf-backend-apply

# Initialize scoring-worker with backend config (will prompt to migrate local state)
make -f services/scoring-worker/Makefile tf-init-backend
```

### Local tfvars for secrets

Create `infra/scoring-worker/terraform.local.tfvars` (gitignored) with:

```hcl
rabbitmq_username = "scoring-worker"
rabbitmq_password = "<password>"
```

### Plan/apply

```bash
make -f services/scoring-worker/Makefile tf-plan-local
make -f services/scoring-worker/Makefile tf-apply-local
```

If Terraform reports a stale lock, you can clear it with:

```bash
terraform -chdir=infra/scoring-worker force-unlock <LOCK_ID>
```

## Local dev with Docker Compose

Bring up RabbitMQ (with management UI) and the scoring worker together:

```bash
docker compose -f services/scoring-worker/docker-compose.yml up --build
```

RabbitMQ management UI: `http://localhost:15672` (user/pass: `guest`/`guest`).

The compose file loads `services/scoring-worker/.env` automatically via `env_file`.
Start by copying `services/scoring-worker/.env.example` to `services/scoring-worker/.env`
and fill in the values. Shell environment variables still override `.env` if set.

## Tests

Container integration tests using `testcontainers-python`. They start real containers against the built image — no mocking.

```bash
# Install test deps (once)
pip install -r services/scoring-worker/tests/requirements-test.txt

# Run tests (builds image first)
make -f services/scoring-worker/Makefile test

# Rebuild the image before tests (useful after code changes)
make -f services/scoring-worker/Makefile test BUILD=1
```

Tests map directly to the BDD feature spec:

- **Scenario 1 (worker starts):** asserts startup log, confirms `awslambdaric` is absent, verifies the container stays alive, verifies graceful SIGTERM shutdown with exit code 0
- **Scenario 2 (fail fast):** parametrized across all required vars — each missing var causes non-zero exit and its name appears in the logs; all missing vars are reported in a single run
- **Scenario 3 (RabbitMQ success):** publishes a request with `request_id`, asserts response contains same `request_id`, `status="success"`, and request queue is empty (ack)
- **Scenario 4 (RabbitMQ failure):** publishes an invalid request, asserts no success response and logs contain the `request_id`
- **Scenario 5 (Health):** liveness returns `200`; readiness returns `200` when RabbitMQ is connected and `503` when it is not

## Key design decisions

- **No Lambda code.** `score-processor-lambda/` is not imported or referenced. The worker is a clean slate.
- **Non-root user.** Runs as `appuser` (uid 1001) in group `appgroup`.
- **`PYTHONUNBUFFERED=1`** ensures logs appear immediately in container stdout — critical for observability.
- **`PYTHONDONTWRITEBYTECODE=1`** keeps the image clean.
- **HEALTHCHECK** uses `pgrep -f worker.py` — appropriate for a non-HTTP worker process.
- **Layer order** in the Dockerfile keeps dependency layers above app code so iterating on `worker.py` doesn't invalidate the pip install cache.

## Roadmap / next phases

- **Phase 3: Operational hardening**
  - Add structured logging (JSON), log correlation, and metrics
  - Add dead-letter queue strategy and configurable retry/requeue policy
  - Add graceful shutdown drain timeout and in-flight job tracking
- **Phase 4: Deployment integration**
  - Provide ECS/Kubernetes manifests and Helm chart
  - Add readiness/liveness probes with RabbitMQ connectivity checks
- **Phase 5: Observability**
  - Standardized tracing, log shipping, and scoring latency dashboards
