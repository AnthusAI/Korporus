terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}

data "aws_region" "current" {}

locals {
  account_id  = data.aws_caller_identity.current.account_id
  region      = data.aws_region.current.name
  service     = "scoring-worker"
  name_prefix = "${local.service}-${var.environment}"

  # ARN of the Secrets Manager secret that holds all Plexus config
  plexus_secret_arn = "arn:aws:secretsmanager:${local.region}:${local.account_id}:secret:plexus/${var.environment}/config"
}
