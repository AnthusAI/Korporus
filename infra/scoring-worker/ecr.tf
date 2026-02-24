resource "aws_ecr_repository" "scoring_worker" {
  name                 = "korporus/scoring-worker"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Service     = local.service
    ManagedBy   = "terraform"
  }
}

resource "aws_ecr_lifecycle_policy" "scoring_worker" {
  repository = aws_ecr_repository.scoring_worker.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Keep last 10 images per tag prefix"
        selection = {
          tagStatus   = "any"
          countType   = "imageCountMoreThan"
          countNumber = 10
        }
        action = {
          type = "expire"
        }
      }
    ]
  })
}
