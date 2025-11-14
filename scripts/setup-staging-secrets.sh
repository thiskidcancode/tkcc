#!/bin/bash
# Setup GitHub secrets for staging environment

gh secret set AWS_ROLE_ARN --env staging --body "arn:aws:iam::322444633390:role/TkccGitHubActionsRole-staging"
gh secret set CLOUDFRONT_DISTRIBUTION_ID --env staging --body "E19R8IW5NL2L9P"
gh secret set S3_BUCKET_NAME --env staging --body "tkcc-marketing-site-staging"

echo "✅ Staging secrets configured!"