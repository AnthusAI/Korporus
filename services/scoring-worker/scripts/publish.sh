#!/usr/bin/env bash
# publish.sh — Send a test scoring job message to the live RabbitMQ broker.
#
# Registers a one-shot Fargate task definition using python:3.11-slim,
# runs it inside the VPC so it can reach the private broker, waits for
# completion, and prints the CloudWatch log output.
#
# Usage (called by `make publish`):
#   publish.sh <scoring_job_id> <request_id> <cluster> <subnet> <sg> <region> <rabbitmq_secret_arn> <execution_role_arn>

set -euo pipefail

SCORING_JOB_ID="${1:?SCORING_JOB_ID required}"
REQUEST_ID="${2:?REQUEST_ID required}"
CLUSTER="${3:?CLUSTER required}"
SUBNET="${4:?SUBNET required}"
SG="${5:?SG required}"
REGION="${6:?REGION required}"
RABBITMQ_ARN="${7:?RABBITMQ_ARN required}"
EXECUTION_ROLE="${8:?EXECUTION_ROLE required}"
LOG_GROUP="/ecs/scoring-worker-staging"
FAMILY="scoring-worker-publisher"

PYTHON_SCRIPT=$(cat <<'PYEOF'
import asyncio, json, boto3
import aio_pika

secret_raw = boto3.client("secretsmanager").get_secret_value(SecretId="korporus/scoring-worker/rabbitmq")["SecretString"]
url = json.loads(secret_raw)["amqp-url"]

import os
payload = json.dumps({"request_id": os.environ["REQUEST_ID"], "scoring_job_id": os.environ["SCORING_JOB_ID"]})

async def publish():
    conn = await aio_pika.connect_robust(url)
    async with conn:
        ch = await conn.channel()
        await ch.declare_queue("plexus_scoring_requests", durable=True)
        await ch.default_exchange.publish(
            aio_pika.Message(
                body=payload.encode(),
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
            ),
            routing_key="plexus_scoring_requests",
        )
    print(f"Published: {payload}")

asyncio.run(publish())
PYEOF
)

CMD="pip install aio-pika boto3 -q && python3 -c '${PYTHON_SCRIPT}'"

# ── Register (or re-register) the one-shot task definition ───────────────────
TASK_DEF=$(aws ecs register-task-definition \
  --family "${FAMILY}" \
  --requires-compatibilities FARGATE \
  --network-mode awsvpc \
  --cpu 256 \
  --memory 512 \
  --execution-role-arn "${EXECUTION_ROLE}" \
  --task-role-arn "${EXECUTION_ROLE}" \
  --container-definitions "$(jq -n \
    --arg cmd "${CMD}" \
    --arg region "${REGION}" \
    --arg log_group "${LOG_GROUP}" \
    --arg scoring_job_id "${SCORING_JOB_ID}" \
    --arg request_id "${REQUEST_ID}" \
    '[{
      "name": "publisher",
      "image": "python:3.11-slim",
      "essential": true,
      "command": ["sh", "-c", $cmd],
      "environment": [
        {"name": "AWS_DEFAULT_REGION", "value": $region},
        {"name": "SCORING_JOB_ID",     "value": $scoring_job_id},
        {"name": "REQUEST_ID",         "value": $request_id}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group":         $log_group,
          "awslogs-region":        $region,
          "awslogs-stream-prefix": "publisher"
        }
      }
    }]'
  )" \
  --query "taskDefinition.taskDefinitionArn" \
  --output text)

echo "Task definition: ${TASK_DEF}"

# ── Launch the one-shot task ──────────────────────────────────────────────────
TASK_ARN=$(aws ecs run-task \
  --cluster "${CLUSTER}" \
  --launch-type FARGATE \
  --task-definition "${TASK_DEF}" \
  --network-configuration "awsvpcConfiguration={subnets=[${SUBNET}],securityGroups=[${SG}],assignPublicIp=ENABLED}" \
  --query "tasks[0].taskArn" \
  --output text)

echo "Task launched: ${TASK_ARN}"
echo "Waiting for task to stop..."

aws ecs wait tasks-stopped --cluster "${CLUSTER}" --tasks "${TASK_ARN}"

EXIT_CODE=$(aws ecs describe-tasks \
  --cluster "${CLUSTER}" \
  --tasks "${TASK_ARN}" \
  --query "tasks[0].containers[0].exitCode" \
  --output text)

echo "Exit code: ${EXIT_CODE}"

# ── Fetch logs ────────────────────────────────────────────────────────────────
TASK_ID="${TASK_ARN##*/}"
LOG_STREAM="publisher/publisher/${TASK_ID}"

echo "Logs from ${LOG_GROUP}/${LOG_STREAM}:"
aws logs get-log-events \
  --log-group-name "${LOG_GROUP}" \
  --log-stream-name "${LOG_STREAM}" \
  --query "events[*].message" \
  --output text 2>/dev/null || echo "(no logs yet)"

if [ "${EXIT_CODE}" != "0" ]; then
  echo "ERROR: publisher task exited with code ${EXIT_CODE}"
  exit 1
fi
