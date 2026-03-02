output "ecr_repository_url" {
  description = "ECR repository URL for the shell container image"
  value       = aws_ecr_repository.shell.repository_url
}

output "app_runner_service_url" {
  description = "App Runner service URL (HTTPS)"
  value       = "https://${aws_apprunner_service.shell.service_url}"
}

output "app_runner_service_arn" {
  description = "App Runner service ARN"
  value       = aws_apprunner_service.shell.arn
}
