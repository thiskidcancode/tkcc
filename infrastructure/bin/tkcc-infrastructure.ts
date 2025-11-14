#!/usr/bin/env node
import 'source-map-support/register';
import 'dotenv/config';
import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { MarketingSiteStack } from '../lib/marketing-site-stack';
import { DnsStack } from '../lib/dns-stack';
import { ApprenticeshipPlatformStack } from '../lib/apprenticeship-platform-stack';

const app = new cdk.App();

// Multi-account configuration from context or environment
const stagingAccount = app.node.tryGetContext('stagingAccount') || process.env.CDK_STAGING_ACCOUNT;
const productionAccount = app.node.tryGetContext('productionAccount') || process.env.CDK_PRODUCTION_ACCOUNT;

if (!stagingAccount || !productionAccount) {
  throw new Error('Account numbers must be provided via context or environment variables:\n' +
    '  --context stagingAccount=123456789012 --context productionAccount=987654321098\n' +
    '  OR set CDK_STAGING_ACCOUNT and CDK_PRODUCTION_ACCOUNT environment variables');
}

const stagingEnv = {
  account: stagingAccount,
  region: 'us-east-1',
};

const productionEnv = {
  account: productionAccount,
  region: 'us-east-1',
};

// Marketing Site Stacks - Staging and Production
const marketingSiteStagingStack = new MarketingSiteStack(app, 'TkccMarketingSiteStagingStack', {
  env: stagingEnv,
  description: 'Marketing site staging infrastructure for ThisKidCanCode',
  // No DNS or certificate for staging - uses CloudFront domain
  environment: 'staging',
});

// DNS Stack - only create if certificate ARN is provided (production deployments)
let dnsStack: DnsStack | undefined;
let marketingSiteProductionStack: MarketingSiteStack | undefined;

const certificateArn = app.node.tryGetContext('certificateArn');
if (certificateArn) {
  dnsStack = new DnsStack(app, 'TkccDnsStack', {
    env: productionEnv,
    description: 'DNS infrastructure for ThisKidCanCode',
  });

  marketingSiteProductionStack = new MarketingSiteStack(app, 'TkccMarketingSiteStack', {
    env: productionEnv,
    description: 'Marketing site production infrastructure for ThisKidCanCode',
    hostedZone: dnsStack.hostedZone,
    certificate: dnsStack.certificate,
    environment: 'production',
  });
}

// Apprenticeship Platform Stack - app.thiskidcancode.com (only if DNS exists)
let apprenticeshipStack: ApprenticeshipPlatformStack | undefined;
if (dnsStack) {
  apprenticeshipStack = new ApprenticeshipPlatformStack(app, 'TkccApprenticeshipStack', {
    env: productionEnv,
    description: 'Apprenticeship platform infrastructure for ThisKidCanCode',
    hostedZone: dnsStack.hostedZone,
    certificate: dnsStack.certificate,
  });
}

// Add tags to all resources
cdk.Tags.of(app).add('Project', 'ThisKidCanCode');
cdk.Tags.of(app).add('ManagedBy', 'CDK');

// Environment-specific tags
cdk.Tags.of(marketingSiteStagingStack).add('Environment', 'Staging');
if (marketingSiteProductionStack) {
  cdk.Tags.of(marketingSiteProductionStack).add('Environment', 'Production');
}
if (apprenticeshipStack) {
  cdk.Tags.of(apprenticeshipStack).add('Environment', 'Production');
}