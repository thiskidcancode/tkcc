import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';

interface ApprenticeshipPlatformStackProps extends cdk.StackProps {
  hostedZone: route53.IHostedZone;
  certificate: acm.ICertificate;
}

export class ApprenticeshipPlatformStack extends cdk.Stack {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;

  constructor(scope: Construct, id: string, props: ApprenticeshipPlatformStackProps) {
    super(scope, id, props);

    // S3 bucket for apprenticeship platform
    this.bucket = new s3.Bucket(this, 'ApprenticeshipBucket', {
      bucketName: `tkcc-apprenticeship-platform-${props.env?.account}-${props.env?.region}`,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      versioned: true,
    });

    // Origin Access Control for CloudFront
    const originAccessControl = new cloudfront.S3OriginAccessControl(this, 'AppOAC', {
      description: 'OAC for TKCC apprenticeship platform',
    });

    // CloudFront distribution with custom domain
    this.distribution = new cloudfront.Distribution(this, 'ApprenticeshipDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(this.bucket, {
          originAccessControl,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: new cloudfront.CachePolicy(this, 'AppCachePolicy', {
          defaultTtl: cdk.Duration.minutes(5), // Short cache for dynamic learning content
          maxTtl: cdk.Duration.hours(1),
          minTtl: cdk.Duration.seconds(0),
          headerBehavior: cloudfront.CacheHeaderBehavior.allowList('Authorization'), // For user auth
        }),
        compress: true,
        responseHeadersPolicy: new cloudfront.ResponseHeadersPolicy(this, 'AppSecurityHeaders', {
          securityHeadersBehavior: {
            contentTypeOptions: { override: true },
            frameOptions: { frameOption: cloudfront.HeadersFrameOption.DENY, override: true },
            referrerPolicy: { referrerPolicy: cloudfront.HeadersReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN, override: true },
            strictTransportSecurity: { 
              accessControlMaxAge: cdk.Duration.seconds(31536000), // 1 year
              includeSubdomains: true, 
              override: true 
            },
          },
        }),
      },
      domainNames: ['app.thiskidcancode.com'], // 🎯 This is the key part!
      certificate: props.certificate, // Uses your wildcard cert
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html', // SPA routing - let React handle routes
        },
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100,
      comment: 'ThisKidCanCode Apprenticeship Platform Distribution',
    });

    // 🎯 Route 53 A record - this creates the subdomain!
    new route53.ARecord(this, 'ApprenticeshipARecord', {
      zone: props.hostedZone, // Uses the existing hosted zone
      recordName: 'app', // Creates app.thiskidcancode.com
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(this.distribution)
      ),
    });

    // Marketing-friendly alias
    new route53.CnameRecord(this, 'LearnRedirect', {
      zone: props.hostedZone,
      recordName: 'learn', // learn.thiskidcancode.com → app.thiskidcancode.com
      domainName: 'app.thiskidcancode.com',
    });

    // Outputs
    new cdk.CfnOutput(this, 'AppBucketName', {
      value: this.bucket.bucketName,
      description: 'S3 bucket for apprenticeship platform',
    });

    new cdk.CfnOutput(this, 'AppDistributionId', {
      value: this.distribution.distributionId,
      description: 'CloudFront distribution ID for apprenticeship platform',
    });

    new cdk.CfnOutput(this, 'AppUrl', {
      value: 'https://app.thiskidcancode.com',
      description: 'Apprenticeship platform URL',
    });
  }
}