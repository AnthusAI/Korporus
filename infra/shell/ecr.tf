resource "aws_ecr_repository" "shell" {
  name                 = "korporus/shell"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Service     = local.service
    Environment = var.environment
  }
}

resource "aws_ecr_lifecycle_policy" "shell" {
  repository = aws_ecr_repository.shell.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 10 images"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 10
        }
        action = { type = "expire" }
      }
    ]
  })
}
