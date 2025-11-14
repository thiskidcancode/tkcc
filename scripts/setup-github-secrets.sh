#!/bin/bash

# Setup GitHub secrets from CDK outputs
# Usage: ./setup-github-secrets.sh [environment]
# Example: ./setup-github-secrets.sh production
#          ./setup-github-secrets.sh sandbox

set -e

ENVIRONMENT=${1:-production}
echo "🔧 Setting up GitHub secrets for $ENVIRONMENT environment..."

# Check if gh CLI is available
if ! command -v gh &> /dev/null; then
    echo "❌ GitHub CLI (gh) is required. Install: brew install gh"
    exit 1
fi

# Check if AWS CLI is available
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is required. Install: brew install awscli"
    exit 1
fi

# Get CDK outputs
echo "📊 Fetching CDK outputs..."

# Determine stack name and profile based on environment
if [ "$ENVIRONMENT" = "staging" ]; then
    STACK_NAME="TkccMarketingSiteStagingStack"
    AWS_PROFILE="tkcc-staging"
else
    STACK_NAME="TkccMarketingSiteStack"
    AWS_PROFILE="tkcc-prod"
fi

# Get deployment role ARN from marketing site stack
ROLE_ARN=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --profile $AWS_PROFILE \
    --query 'Stacks[0].Outputs[?OutputKey==`DeploymentRoleArn`].OutputValue' \
    --output text)

# Get CloudFront distribution ID
DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --profile $AWS_PROFILE \
    --query 'Stacks[0].Outputs[?OutputKey==`DistributionId`].OutputValue' \
    --output text)

# Get S3 bucket name
BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name $STACK_NAME \
    --profile $AWS_PROFILE \
    --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' \
    --output text)

# Validate outputs
if [ -z "$ROLE_ARN" ] || [ -z "$DISTRIBUTION_ID" ] || [ -z "$BUCKET_NAME" ]; then
    echo "❌ Failed to get CDK outputs. Make sure stacks are deployed."
    echo "Role ARN: $ROLE_ARN"
    echo "Distribution ID: $DISTRIBUTION_ID"
    echo "Bucket Name: $BUCKET_NAME"
    exit 1
fi

echo "✅ CDK outputs retrieved:"
echo "  Role ARN: $ROLE_ARN"
echo "  Distribution ID: $DISTRIBUTION_ID"
echo "  Bucket Name: $BUCKET_NAME"

# Set GitHub secrets using gh CLI with env bypass
echo "🔐 Setting GitHub secrets for $ENVIRONMENT environment..."

env -u GH_TOKEN gh secret set AWS_ROLE_ARN --env "$ENVIRONMENT" --body "$ROLE_ARN"
env -u GH_TOKEN gh secret set CLOUDFRONT_DISTRIBUTION_ID --env "$ENVIRONMENT" --body "$DISTRIBUTION_ID"
env -u GH_TOKEN gh secret set S3_BUCKET_NAME --env "$ENVIRONMENT" --body "$BUCKET_NAME"

echo "✅ GitHub secrets configured for $ENVIRONMENT environment!"
echo ""
echo "🎯 Next steps:"
echo "1. Set up GitHub Environments in repository settings:"
echo "   - Go to Settings > Environments"
echo "   - Create 'production' and 'sandbox' environments"
echo "   - Add protection rules for production (require reviews)"
echo ""
echo "2. Add Stripe keys as environment variables:"
echo "   gh variable set STRIPE_PUBLISHABLE_KEY --env $ENVIRONMENT --body 'pk_test_...'"
echo ""
echo "3. For production, use live Stripe keys:"
echo "   gh variable set STRIPE_PUBLISHABLE_KEY --env production --body 'pk_live_...'"
echo ""
echo "🚀 $ENVIRONMENT environment is configured with OIDC authentication!"