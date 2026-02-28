# Terraform Backend Bootstrap

This folder bootstraps the S3 bucket and DynamoDB table used by the main
Terraform state backend. It is intentionally separate because a Terraform
configuration cannot create the backend it uses.

## Usage

1. Initialize and apply the bootstrap:
   ```bash
   terraform -chdir=infra/terraform-backend init
   terraform -chdir=infra/terraform-backend apply \
     -var="state_bucket_name=<unique-bucket-name>" \
     -var="lock_table_name=terraform-locks"
   ```

2. Configure the main stack backend (scoring-worker):
   ```bash
   terraform -chdir=infra/scoring-worker init \
     -backend-config="bucket=<unique-bucket-name>" \
     -backend-config="key=scoring-worker/terraform.tfstate" \
     -backend-config="region=us-west-2" \
     -backend-config="dynamodb_table=terraform-locks" \
     -backend-config="encrypt=true"
   ```

3. One-time state migration:
   - If you previously used local state, Terraform will prompt to migrate
     it to the S3 backend. Accept the prompt. You should not need to
     migrate again unless you change the backend configuration.
