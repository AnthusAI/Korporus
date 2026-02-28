data "aws_vpc" "default" {
  default = true
}

data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

resource "aws_security_group" "scoring_worker" {
  name        = "${local.name_prefix}-sg"
  description = "Scoring worker ECS tasks - egress only"
  vpc_id      = data.aws_vpc.default.id

  # No ingress rules: the worker is a queue consumer, not a server.
  # ECS health checks are performed by the ECS agent over localhost,
  # not via inbound network traffic.

  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Service     = local.service
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
