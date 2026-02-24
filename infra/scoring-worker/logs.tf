resource "aws_cloudwatch_log_group" "scoring_worker" {
  name              = "/ecs/${local.name_prefix}"
  retention_in_days = 30

  tags = {
    Service     = local.service
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
