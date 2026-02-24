resource "aws_ecs_cluster" "scoring_worker" {
  name = "scoring-worker-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Service   = local.service
    ManagedBy = "terraform"
  }
}

resource "aws_ecs_task_definition" "scoring_worker" {
  family                   = local.name_prefix
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = aws_iam_role.execution.arn
  task_role_arn            = aws_iam_role.task.arn

  # Ensure the amqp-url key is written to Secrets Manager before the task
  # definition is registered, so ECS can resolve it at task launch.
  depends_on = [aws_secretsmanager_secret_version.rabbitmq_with_url]

  container_definitions = jsonencode([
    {
      name  = "scoring-worker"
      image = "${aws_ecr_repository.scoring_worker.repository_url}:${var.environment}"

      essential = true

      portMappings = [
        {
          containerPort = 8080
          protocol      = "tcp"
        }
      ]

      # Secrets pulled from Secrets Manager at task launch.
      # Format: "arn:...:secret-name:json-key::"
      secrets = [
        {
          name      = "PLEXUS_ACCOUNT_KEY"
          valueFrom = "${local.plexus_secret_arn}:account-key::"
        },
        {
          name      = "PLEXUS_API_KEY"
          valueFrom = "${local.plexus_secret_arn}:api-key::"
        },
        {
          name      = "PLEXUS_API_URL"
          valueFrom = "${local.plexus_secret_arn}:api-url::"
        },
        {
          name      = "PLEXUS_LANGGRAPH_CHECKPOINTER_POSTGRES_URI"
          valueFrom = "${local.plexus_secret_arn}:postgres-uri::"
        },
        {
          name      = "OPENAI_API_KEY"
          valueFrom = "${local.plexus_secret_arn}:openai-api-key::"
        },
        {
          # Full amqps:// URL written by Terraform after broker creation.
          # Depends on aws_secretsmanager_secret_version.rabbitmq_with_url.
          name      = "PLEXUS_RABBITMQ_URL"
          valueFrom = "${data.aws_secretsmanager_secret.rabbitmq.arn}:amqp-url::"
        },
      ]

      environment = [
        { name = "PLEXUS_RABBITMQ_REQUEST_QUEUE",  value = "plexus_scoring_requests" },
        { name = "PLEXUS_RABBITMQ_RESPONSE_QUEUE", value = "plexus_scoring_responses" },
        { name = "PLEXUS_RABBITMQ_PREFETCH",       value = "1" },
        { name = "PLEXUS_SCORING_MODE",            value = "real" },
        { name = "PLEXUS_FETCH_SCHEMA_FROM_TRANSPORT", value = "false" },
        { name = "LOG_FORMAT",                     value = "json" },
      ]

      healthCheck = {
        command     = ["CMD-SHELL", "python -c \"import urllib.request; urllib.request.urlopen('http://localhost:8080/readyz')\" || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.scoring_worker.name
          "awslogs-region"        = local.region
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])

  tags = {
    Service     = local.service
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}

resource "aws_ecs_service" "scoring_worker" {
  name            = local.name_prefix
  cluster         = aws_ecs_cluster.scoring_worker.id
  task_definition = aws_ecs_task_definition.scoring_worker.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  # Force a new deployment when the task definition changes
  force_new_deployment = true

  network_configuration {
    subnets          = data.aws_subnets.default.ids
    security_groups  = [aws_security_group.scoring_worker.id]
    # Public IP required in default VPC for outbound internet access
    # (ECR pulls, Plexus API, RabbitMQ). Replace with false + NAT gateway
    # when moving to private subnets in production.
    assign_public_ip = true
  }

  # Ignore desired_count changes in-place so manual scaling via console
  # or auto-scaling doesn't get reverted on next apply.
  lifecycle {
    ignore_changes = [desired_count]
  }

  tags = {
    Service     = local.service
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
