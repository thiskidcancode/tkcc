#!/bin/bash
# Deploy staging infrastructure
# Usage: ./deploy-staging.sh [aws-profile]
# Example: ./deploy-staging.sh my-staging-profile

source .env

if [ -n "$1" ]; then
  export AWS_PROFILE="$1"
fi

echo "Deploying to staging account: $CDK_STAGING_ACCOUNT"
echo "Using AWS profile: ${AWS_PROFILE:-default}"

pnpm cdk deploy TkccMarketingSiteStagingStack