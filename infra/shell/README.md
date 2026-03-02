# Korporus Shell — Infrastructure

Terraform for the Korporus shell container on AWS App Runner.

## Resources

- **ECR repository** — `korporus/shell` — stores container images
- **App Runner service** — serves the shell + Hello app federated bundle
- **IAM roles** — ECR pull access, instance role

## One-time setup

```bash
# Bootstrap the Terraform S3 backend first (see infra/terraform-backend/)
cd infra/shell
terraform init -backend-config=../terraform-backend/backend.hcl
terraform apply
```

## Deploy a new image

```bash
# From the repo root:
IMAGE_TAG=$(git rev-parse --short HEAD)
AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=us-east-1
ECR_URL="$AWS_ACCOUNT.dkr.ecr.$AWS_REGION.amazonaws.com/korporus/shell"

# Authenticate Docker with ECR
aws ecr get-login-password --region $AWS_REGION \
  | docker login --username AWS --password-stdin "$ECR_URL"

# Build and push
docker build -t "$ECR_URL:$IMAGE_TAG" -t "$ECR_URL:latest" .
docker push "$ECR_URL:$IMAGE_TAG"
docker push "$ECR_URL:latest"

# Update App Runner to the new image tag
cd infra/shell
terraform apply -var="image_tag=$IMAGE_TAG"
```

## App Runner scale-to-zero note

App Runner does not natively support scale-to-zero on the standard tier. For the POC, the service runs at minimum capacity (`0.25 vCPU / 0.5 GB`). To simulate a cold-start, you can pause and resume the service via the AWS Console or CLI:

```bash
# Pause (scales to zero, stops billing for compute)
aws apprunner pause-service --service-arn <arn>

# Resume (wakes the service)
aws apprunner resume-service --service-arn <arn>
```

When the service is paused and a demo app user hits the Amplify URL, the demo app will show the "warming up" message until the shell is resumed.
