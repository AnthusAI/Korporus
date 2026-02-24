# ── RabbitMQ credentials from Secrets Manager ────────────────────────────────
# The secret must exist before running terraform apply.
# Create it once manually:
#   aws secretsmanager create-secret \
#     --name "korporus/scoring-worker/rabbitmq" \
#     --secret-string '{"username":"scoring-worker","password":"<strong-password>"}'

data "aws_secretsmanager_secret" "rabbitmq" {
  name = "korporus/scoring-worker/rabbitmq"
}

data "aws_secretsmanager_secret_version" "rabbitmq" {
  secret_id = data.aws_secretsmanager_secret.rabbitmq.id
}

locals {
  rabbitmq_creds    = jsondecode(data.aws_secretsmanager_secret_version.rabbitmq.secret_string)
  rabbitmq_username = local.rabbitmq_creds["username"]
  rabbitmq_password = local.rabbitmq_creds["password"]
}

# ── Security group for the Amazon MQ broker ───────────────────────────────────
resource "aws_security_group" "mq" {
  name        = "${local.name_prefix}-mq-sg"
  description = "Amazon MQ broker - AMQPS from scoring worker only"
  vpc_id      = data.aws_vpc.default.id

  ingress {
    description     = "AMQPS from scoring worker tasks"
    from_port       = 5671
    to_port         = 5671
    protocol        = "tcp"
    security_groups = [aws_security_group.scoring_worker.id]
  }

  tags = {
    Service     = local.service
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# ── Amazon MQ broker ──────────────────────────────────────────────────────────
resource "aws_mq_broker" "scoring_worker" {
  broker_name        = "${local.name_prefix}-rabbitmq"
  engine_type        = "RabbitMQ"
  engine_version     = "3.13"
  host_instance_type = "mq.t3.micro"
  deployment_mode    = "SINGLE_INSTANCE"

  # Keep broker private within the VPC; worker tasks reach it over the
  # VPC network. Never expose the management console to the internet.
  publicly_accessible = false

  auto_minor_version_upgrade = true

  # Single-instance brokers require exactly one subnet
  subnet_ids         = [tolist(data.aws_subnets.default.ids)[0]]
  security_groups    = [aws_security_group.mq.id]

  user {
    username = local.rabbitmq_username
    password = local.rabbitmq_password
  }

  maintenance_window_start_time {
    day_of_week = "SUNDAY"
    time_of_day = "03:00"
    time_zone   = "UTC"
  }

  tags = {
    Service     = local.service
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

# ── Write the full AMQP URL back to Secrets Manager ──────────────────────────
# ECS injects PLEXUS_RABBITMQ_URL from this key at task launch.
# The URL format Amazon MQ requires: amqps://user:pass@endpoint:5671
locals {
  rabbitmq_amqp_url = "amqps://${local.rabbitmq_username}:${local.rabbitmq_password}@${replace(aws_mq_broker.scoring_worker.instances[0].endpoints[0], "amqps://", "")}/"
}

resource "aws_secretsmanager_secret_version" "rabbitmq_with_url" {
  secret_id = data.aws_secretsmanager_secret.rabbitmq.id

  secret_string = jsonencode({
    username = local.rabbitmq_username
    password = local.rabbitmq_password
    amqp-url = local.rabbitmq_amqp_url
  })

  # Prevent replacement every apply when the value hasn't changed
  lifecycle {
    ignore_changes = [version_stages]
  }
}
