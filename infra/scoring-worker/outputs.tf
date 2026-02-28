output "ecr_repository_url" {
  description = "ECR repository URL — use this as the image base when pushing"
  value       = aws_ecr_repository.scoring_worker.repository_url
}

output "ecr_repository_arn" {
  description = "ECR repository ARN"
  value       = aws_ecr_repository.scoring_worker.arn
}

output "ecs_cluster_name" {
  description = "ECS cluster name"
  value       = aws_ecs_cluster.scoring_worker.name
}

output "ecs_cluster_arn" {
  description = "ECS cluster ARN"
  value       = aws_ecs_cluster.scoring_worker.arn
}

output "ecs_service_name" {
  description = "ECS service name"
  value       = aws_ecs_service.scoring_worker.name
}

output "cloudwatch_log_group" {
  description = "CloudWatch log group name for scoring worker logs"
  value       = aws_cloudwatch_log_group.scoring_worker.name
}

output "execution_role_arn" {
  description = "ECS task execution role ARN"
  value       = aws_iam_role.execution.arn
}

output "mq_broker_id" {
  description = "Amazon MQ broker ID"
  value       = aws_mq_broker.scoring_worker.id
}

output "mq_broker_arn" {
  description = "Amazon MQ broker ARN"
  value       = aws_mq_broker.scoring_worker.arn
}

output "mq_amqps_endpoint" {
  description = "AMQPS endpoint for the RabbitMQ broker"
  value       = aws_mq_broker.scoring_worker.instances[0].endpoints[0]
}
