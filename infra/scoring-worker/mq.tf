# ── RabbitMQ secret reference ────────────────────────────────────────────────
# Secret must exist before running terraform apply.
# Suggested shape (include amqp-url for ECS tasks):
#   aws secretsmanager create-secret \
#     --name "korporus/scoring-worker/rabbitmq" \
#     --secret-string '{"username":"scoring-worker","password":"<strong-password>","amqp-url":"amqps://user:pass@host:5671/"}'

data "aws_secretsmanager_secret" "rabbitmq" {
  name = "korporus/scoring-worker/rabbitmq"
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
    username = var.rabbitmq_username
    password = var.rabbitmq_password
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

# NOTE: Terraform no longer writes the AMQP URL into Secrets Manager.
# Keep the secret updated out-of-band to avoid secrets in state.
