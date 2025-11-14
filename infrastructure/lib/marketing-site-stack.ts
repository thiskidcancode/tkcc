import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

interface MarketingSiteStackProps extends cdk.StackProps {
  hostedZone?: route53.IHostedZone;
  certificate?: acm.ICertificate;
  environment: 'staging' | 'production';
}

export class MarketingSiteStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;
  public readonly deploymentRole: iam.Role;

  constructor(scope: Construct, id: string, props: MarketingSiteStackProps) {
    super(scope, id, props);

    // S3 bucket for static website hosting
    this.bucket = new s3.Bucket(this, 'MarketingSiteBucket', {
      bucketName: `tkcc-marketing-site-${props.environment}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      versioned: true,
      lifecycleRules: [
        {
          id: 'DeleteOldVersions',
          enabled: true,
          noncurrentVersionExpiration: cdk.Duration.days(30),
        },
      ],
    });

    // Origin Access Control for CloudFront
    const originAccessControl = new cloudfront.S3OriginAccessControl(this, 'OAC', {
      description: 'OAC for TKCC marketing site',
    });

    // CloudFront distribution
    const distributionProps: any = {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket, {
          originAccessControl,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
      },
      comment: `ThisKidCanCode Marketing Site Distribution (${props.environment})`,
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: '/404.html',
        },
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: '/404.html',
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // US, Canada, Europe
    };

    // Add domain and certificate only for production
    if (props.environment === 'production' && props.certificate) {
      distributionProps.domainNames = ['thiskidcancode.com', 'www.thiskidcancode.com'];
      distributionProps.certificate = props.certificate;
    }

    this.distribution = new cloudfront.Distribution(this, 'MarketingSiteDistribution', distributionProps);

    // Route 53 records (only for production)
    if (props.environment === 'production' && props.hostedZone) {
      new route53.ARecord(this, 'MarketingSiteARecord', {
        zone: props.hostedZone,
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(this.distribution)
        ),
      });

      new route53.ARecord(this, 'MarketingSiteWwwARecord', {
        zone: props.hostedZone,
        recordName: 'www',
        target: route53.RecordTarget.fromAlias(
          new targets.CloudFrontTarget(this.distribution)
        ),
      });
    }
    // Staging uses CloudFront domain directly - no DNS records needed

    // IAM role for GitHub Actions deployment
    this.deploymentRole = new iam.Role(this, 'GitHubActionsRole', {
      roleName: `TkccGitHubActionsRole-${props.environment}`,
      assumedBy: new iam.WebIdentityPrincipal(
        `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': 'repo:thiskidcancode/tkcc:*',
          },
        }
      ),
      description: 'Role for GitHub Actions to deploy TKCC infrastructure',
    });

    // Grant deployment permissions
    this.bucket.grantReadWrite(this.deploymentRole);
    this.deploymentRole.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'cloudfront:CreateInvalidation',
          'cloudfront:GetInvalidation',
          'cloudfront:ListInvalidations',
        ],
        resources: [this.distribution.distributionArn],
      })
    );

    // Outputs
    new cdk.CfnOutput(this, 'BucketName', {
      value: this.bucket.bucketName,
      description: 'S3 bucket name for marketing site',
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: this.distribution.distributionId,
      description: 'CloudFront distribution ID',
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: this.distribution.distributionDomainName,
      description: 'CloudFront distribution domain name',
    });

    new cdk.CfnOutput(this, 'DeploymentRoleArn', {
      value: this.deploymentRole.roleArn,
      description: 'IAM role ARN for GitHub Actions deployment',
    });

    new cdk.CfnOutput(this, 'WebsiteUrl', {
      value: props.environment === 'production' 
        ? 'https://thiskidcancode.com'
        : 'https://staging.thiskidcancode.com',
      description: 'Marketing site URL',
    });
  }
}