# E2B on AWS Runbook

This runbook documents how we deploy the E2B stack.
It assumes DNS for `korpor.us` is managed in a separate AWS
account, and we will provide DNS records to that account owner when needed.

## Layout

- CloudFormation: `infra/e2b/iac/e2b-setup-env.yml`
- Terraform: `infra/e2b/iac/infra-iac/`
- Nomad: `infra/e2b/iac/nomad/`
- Scripts: `infra/e2b/iac/packages/`

## Prerequisites

- AWS account access in the deployment account (this one).
- SSH key pair available in this account for bastion access.
- Domain: `e2b.korpor.us` is available.
- DNS owner available to add records in the Route53 account that hosts
  `korpor.us`.

## Deployment Steps

1. **Resolve stack outputs (bastion + ALB)**
   - Capture the bastion IP and ALB DNS name from the CloudFormation stack:
   ```bash
   STACK_NAME=e2b-infra
   BASTION_IP=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query "Stacks[0].Outputs[?OutputKey=='BastionPublicIp'].OutputValue" --output text)
   ALB_DNS=$(aws cloudformation describe-stacks --stack-name "$STACK_NAME" --query "Stacks[0].Outputs[?OutputKey=='PublicALBDNSName'].OutputValue" --output text)
   echo "BASTION_IP=$BASTION_IP"
   echo "ALB_DNS=$ALB_DNS"
   ```

2. **Stage IaC onto the bastion (required)**
   - After the stack is created, copy the IaC to the bastion:
   ```bash
   rsync -av infra/e2b/iac/ "ubuntu@${BASTION_IP}:/tmp/e2b-iac/"
   ssh "ubuntu@${BASTION_IP}" "sudo mkdir -p /opt/infra/e2b && sudo rsync -a /tmp/e2b-iac/ /opt/infra/e2b/"
   ```

3. **Access the bastion**
   - Use the EC2 key pair specified in the CloudFormation stack parameters.
   ```bash
   ssh -i /path/to/your-key.pem "ubuntu@${BASTION_IP}"
   ```

4. **Deploy CloudFormation stack**
   - Use `infra/e2b/iac/e2b-setup-env.yml`.
   - Stack name must be lowercase (e.g., `e2b-infra`).
   - Set domain to `e2b.korpor.us`.
   - Restrict `AllowRemoteSSHIPs` to your IP.
   - Choose x64 or Graviton (x64 is simplest to start).

5. **Request ACM certificate in this account**
   - Domains: `e2b.korpor.us` and `*.e2b.korpor.us`.
   - Capture ACM validation CNAME(s) for DNS.

6. **DNS handoff (to Route53 account owner)**
   Provide:
   - ACM validation CNAME(s) from step 5.
   - Wildcard CNAME record:
     - `*.e2b.korpor.us` -> `${ALB_DNS}`
   Notes:
   - The ALB DNS name appears after the CloudFormation stack completes.
   - This step must be done before ACM can issue the certificate.
   - The wildcard record must be live before API calls like template creation.

7. **Wait for ACM certificate to be ISSUED**
   - Confirm in ACM console.

8. **SSH to bastion and run bootstrap scripts**
   - Use the EC2 key pair to connect.
   - If the stack finished before the IaC was staged, run the scripts manually:
   ```bash
   cd /opt/infra/e2b
   sudo bash infra-iac/init.sh
   sudo bash infra-iac/packer/packer.sh
   sudo bash infra-iac/terraform/start.sh
   sudo bash infra-iac/db/init-db.sh
   sudo bash packages/build.sh
   sudo bash nomad/nomad.sh
   sudo bash nomad/prepare.sh
   sudo bash nomad/deploy.sh
   sudo bash packages/create_template.sh
   ```

9. **Smoke test**
   - The template step above prints `templateID` and `buildID`. Use those
     to confirm build status and create a sandbox:
   ```bash
   ACCESS_TOKEN=$(jq -r '.accessToken' /opt/infra/e2b/infra-iac/db/config.json)
   TEAM_API_KEY=$(jq -r '.teamApiKey' /opt/infra/e2b/infra-iac/db/config.json)
   TEMPLATE_ID=$(jq -r '.templateID' /opt/infra/e2b/.last_template.json)
   BUILD_ID=$(jq -r '.buildID' /opt/infra/e2b/.last_template.json)

   curl -s "https://api.e2b.korpor.us/templates/${TEMPLATE_ID}/builds/${BUILD_ID}/status" \
     -H "Authorization: ${ACCESS_TOKEN}"

   curl -s -X POST "https://api.e2b.korpor.us/sandboxes" \
     -H "X-API-Key: ${TEAM_API_KEY}" \
     -H "Content-Type: application/json" \
     -d "{\"templateID\":\"${TEMPLATE_ID}\"}"
   ```
   - Validate `https://nomad.e2b.korpor.us` loads (after DNS is live).

10. **SDK test suite (optional but recommended)**
   - Run the SDK tests from the repo root:
   ```bash
   E2B_DOMAIN=e2b.korpor.us \
   E2B_API_KEY=<team_api_key> \
   E2B_ACCESS_TOKEN=<access_token> \
   TEMPLATE_ID=<template_id> \
   python -m pytest infra/e2b/iac/test_use_case/test_e2b_sdk.py -v -rs
   ```
   - The S3 test uses `boto3` inside the sandbox. It requires AWS credentials and
     a bucket name. If those are not available, the S3 test will be skipped.

11. **Scoring-worker (Tactus) template**
   - Build and push the scoring-worker image from the repo root:
   ```bash
   docker build -f services/scoring-worker/Dockerfile -t korporus/scoring-worker:e2b-tactus .
   aws ecr get-login-password --region us-west-2 | docker login --username AWS --password-stdin 695039645615.dkr.ecr.us-west-2.amazonaws.com
   docker tag korporus/scoring-worker:e2b-tactus 695039645615.dkr.ecr.us-west-2.amazonaws.com/korporus/scoring-worker:e2b-tactus
   docker push 695039645615.dkr.ecr.us-west-2.amazonaws.com/korporus/scoring-worker:e2b-tactus
   ```
   - On the bastion, create a new template from the ECR image:
   ```bash
   sudo bash /opt/infra/e2b/packages/create_template.sh \
     --ecr-image 695039645615.dkr.ecr.us-west-2.amazonaws.com/korporus/scoring-worker:e2b-tactus
   ```
   - Confirm the template and test Tactus in a sandbox (run from repo root):
   ```bash
   E2B_API_KEY=$(ssh -i /path/to/your-key.pem ubuntu@${BASTION_IP} "jq -r '.teamApiKey' /opt/infra/e2b/infra-iac/db/config.json") \
   TEMPLATE_ID=$(ssh -i /path/to/your-key.pem ubuntu@${BASTION_IP} "jq -r '.templateID' /opt/infra/e2b/.last_template.json") \
   E2B_DOMAIN=e2b.korpor.us \
   python - <<'PY'
   import os
   from e2b import Sandbox

   sbx = Sandbox.create(template=os.environ["TEMPLATE_ID"], timeout=300)
   try:
       res = sbx.commands.run("python -c \"import tactus; print('tactus_ok', getattr(tactus, '__version__', 'unknown'))\"")
       print("tactus import:", res.exit_code, res.stdout.strip(), res.stderr.strip())
   finally:
       sbx.kill()
   PY
   ```
   - Notes:
     - The scoring-worker image includes Tactus, so the import should succeed.
     - `lua` is not installed in this image unless we add it explicitly.

## Outputs to record

- ALB DNS name (for wildcard DNS)
- ACM validation CNAME(s)
- E2B API endpoint
- Any API keys or tokens stored on the bastion (`/opt/config.properties`)

## Cleanup (order matters)

1. **Terraform destroy (on bastion)**
   - Run `terraform destroy` on the bastion in `/opt/infra/e2b/infra-iac/terraform`.
   - Empty S3 buckets and remove ALB resources if the destroy does not.

2. **CloudFormation stack delete**
   - Disable RDS deletion protection if enabled.
   - Delete the stack.

3. **Verify no orphaned resources**
   - EC2 instances, ALBs, RDS, S3 buckets, ECR repos, security groups.

## Common Pitfalls

- Forgetting wildcard DNS -> sandbox subdomains do not resolve.
- Skipping ACM validation -> TLS fails on the ALB.
- Deleting CloudFormation before Terraform -> orphaned resources.
- RDS deletion protection blocks stack deletion.
