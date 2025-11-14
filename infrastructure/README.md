# TKCC Infrastructure

## Deployment

### Prerequisites
Set your AWS account numbers:

```bash
export CDK_STAGING_ACCOUNT=your-staging-account-id
export CDK_PRODUCTION_ACCOUNT=your-production-account-id
```

Or use CDK context:
```bash
pnpm cdk deploy --context stagingAccount=123456789012 --context productionAccount=987654321098
```

### AWS Credentials

Multiple ways to configure AWS credentials:

```bash
# Option 1: Any profile name
aws configure --profile my-staging-profile
export AWS_PROFILE=my-staging-profile

# Option 2: Environment variables
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret

# Option 3: Default credentials (~/.aws/credentials)
# No additional setup needed
```

### Deploy Staging
```bash
# Using .env file (recommended)
pnpm cdk deploy TkccMarketingSiteStagingStack

# Or with specific profile
./deploy-staging.sh my-staging-profile
```

### Deploy Production
```bash
export AWS_PROFILE=my-production-profile
pnpm cdk deploy TkccDnsStack TkccMarketingSiteProductionStack --context certificateArn=arn:aws:acm:...
```

## Security
- Account numbers are not hardcoded
- Use environment variables or CDK context
- OIDC provider ARNs are dynamically generated