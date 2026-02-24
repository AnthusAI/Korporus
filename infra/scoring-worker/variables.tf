variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "us-west-2"
}

variable "environment" {
  description = "Deployment environment (staging or production)"
  type        = string
  default     = "staging"

  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "environment must be 'staging' or 'production'."
  }
}

variable "task_cpu" {
  description = "ECS task CPU units (256, 512, 1024, 2048, 4096)"
  type        = number
  default     = 2048

  validation {
    condition     = contains([256, 512, 1024, 2048, 4096], var.task_cpu)
    error_message = "task_cpu must be one of 256, 512, 1024, 2048, 4096."
  }
}

variable "task_memory" {
  description = "ECS task memory in MiB"
  type        = number
  default     = 4096

  validation {
    condition = (
      (var.task_cpu == 256 && contains([512, 1024, 2048], var.task_memory)) ||
      (var.task_cpu == 512 && contains([1024, 2048, 3072, 4096], var.task_memory)) ||
      (var.task_cpu == 1024 && contains([2048, 3072, 4096, 5120, 6144, 7168, 8192], var.task_memory)) ||
      (var.task_cpu == 2048 && contains([4096, 5120, 6144, 7168, 8192, 9216, 10240, 11264, 12288, 13312, 14336, 15360, 16384], var.task_memory)) ||
      (var.task_cpu == 4096 && contains([8192, 16384, 30720], var.task_memory))
    )
    error_message = "task_memory is not a valid Fargate combination for the selected task_cpu."
  }
}

variable "desired_count" {
  description = "Number of ECS service tasks to run"
  type        = number
  default     = 1
}

variable "rabbitmq_username" {
  description = "RabbitMQ username for the broker user"
  type        = string
  sensitive   = true
}

variable "rabbitmq_password" {
  description = "RabbitMQ password for the broker user"
  type        = string
  sensitive   = true
}
