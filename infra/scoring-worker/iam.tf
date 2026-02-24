data "aws_iam_policy_document" "ecs_trust" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

# ── Task execution role ───────────────────────────────────────────────────────
# Used by the ECS agent to pull the image and inject secrets before the
# container starts. Not visible to application code inside the container.

resource "aws_iam_role" "execution" {
  name               = "${local.name_prefix}-execution-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_trust.json

  tags = {
    Service   = local.service
    ManagedBy = "terraform"
  }
}

resource "aws_iam_role_policy_attachment" "execution_managed" {
  role       = aws_iam_role.execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

data "aws_iam_policy_document" "execution_secrets" {
  statement {
    sid    = "ReadPlexusSecret"
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret",
    ]
    resources = [
      # The secret ARN has a random suffix; match the base name with a wildcard
      "${local.plexus_secret_arn}-*",
      local.plexus_secret_arn,
    ]
  }

  statement {
    sid    = "ReadRabbitMQSecret"
    effect = "Allow"
    actions = [
      "secretsmanager:GetSecretValue",
      "secretsmanager:DescribeSecret",
    ]
    resources = [
      "${data.aws_secretsmanager_secret.rabbitmq.arn}-*",
      data.aws_secretsmanager_secret.rabbitmq.arn,
    ]
  }
}

resource "aws_iam_role_policy" "execution_secrets" {
  name   = "read-secrets"
  role   = aws_iam_role.execution.id
  policy = data.aws_iam_policy_document.execution_secrets.json
}

# ── Task role ─────────────────────────────────────────────────────────────────
# Assumed by application code running inside the container. No AWS API calls
# are required by the worker today; extend this role when that changes.

resource "aws_iam_role" "task" {
  name               = "${local.name_prefix}-task-role"
  assume_role_policy = data.aws_iam_policy_document.ecs_trust.json

  tags = {
    Service   = local.service
    ManagedBy = "terraform"
  }
}

resource "aws_iam_role_policy" "task_cloudwatch" {
  name = "put-metric-data"
  role = aws_iam_role.task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Sid      = "PutMetricData"
      Effect   = "Allow"
      Action   = "cloudwatch:PutMetricData"
      Resource = "*"
    }]
  })
}
