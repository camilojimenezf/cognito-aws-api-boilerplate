#!/bin/bash
set -e  # Exit on error

# Check if environment argument is provided
if [ -z "$1" ]; then
  echo "❌ Usage: $0 <environment> (e.g., development, staging, production)"
  exit 1
fi

ENVIRONMENT=$1
DEPLOY_ENV_FILE=".deploy.${ENVIRONMENT}.env"

# Ensure deploy env file exists
if [ ! -f "$DEPLOY_ENV_FILE" ]; then
  echo "❌ $DEPLOY_ENV_FILE file not found!"
  exit 1
fi

# Source deployment environment variables
echo "🔧 Loading deployment configuration from $DEPLOY_ENV_FILE..."
source "$DEPLOY_ENV_FILE"

# Authenticate Docker with ECR using the specified AWS profile
echo "🔑 Authenticating with AWS ECR using provided credentials..."
export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build & push Docker image
echo "🐳 Building and pushing Docker image..."
docker build --platform linux/amd64 -t $ECR_REPO_NAME .
docker tag $ECR_REPO_NAME:latest $ECR_REPO_FULL_URL:latest
docker push $ECR_REPO_FULL_URL:latest

# Update ECS service
echo "🚀 Updating ECS service: $ECS_SERVICE in cluster: $ECS_CLUSTER (region: $AWS_REGION)..."
aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --force-new-deployment --region $AWS_REGION

echo "✅ Backend deployed successfully!"