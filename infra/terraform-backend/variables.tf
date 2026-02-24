variable "aws_region" {
  description = "AWS region to create backend resources in"
  type        = string
  default     = "us-west-2"
}

variable "state_bucket_name" {
  description = "S3 bucket name for Terraform state"
  type        = string
}

variable "lock_table_name" {
  description = "DynamoDB table name for Terraform state locking"
  type        = string
  default     = "terraform-locks"
}
