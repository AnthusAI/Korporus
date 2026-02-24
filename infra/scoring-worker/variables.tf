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
}

variable "task_memory" {
  description = "ECS task memory in MiB"
  type        = number
  default     = 4096
}

variable "desired_count" {
  description = "Number of ECS service tasks to run"
  type        = number
  default     = 1
}
