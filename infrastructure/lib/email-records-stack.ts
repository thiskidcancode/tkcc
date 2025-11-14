import * as cdk from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

interface EmailRecordsStackProps extends cdk.StackProps {
  hostedZone: route53.IHostedZone;
}

export class EmailRecordsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: EmailRecordsStackProps) {
    super(scope, id, props);

    // Main domain MX record for WorkMail
    new route53.MxRecord(this, 'MainDomainMx', {
      zone: props.hostedZone,
      values: [
        {
          priority: 10,
          hostName: 'inbound-smtp.us-east-1.amazonaws.com',
        },
      ],
      ttl: cdk.Duration.minutes(5),
    });

    // Mail subdomain MX record for SES
    new route53.MxRecord(this, 'MailSubdomainMx', {
      zone: props.hostedZone,
      recordName: 'mail',
      values: [
        {
          priority: 10,
          hostName: 'feedback-smtp.us-east-1.amazonses.com',
        },
      ],
      ttl: cdk.Duration.minutes(5),
    });

    // SPF record for main domain
    new route53.TxtRecord(this, 'MainDomainSpf', {
      zone: props.hostedZone,
      values: [
        'v=spf1 include:amazonses.com ~all',
      ],
      ttl: cdk.Duration.minutes(5),
    });

    // SPF record for mail subdomain
    new route53.TxtRecord(this, 'MailSubdomainSpf', {
      zone: props.hostedZone,
      recordName: 'mail',
      values: [
        'v=spf1 include:amazonses.com ~all',
      ],
      ttl: cdk.Duration.minutes(5),
    });

    // Autodiscover record for WorkMail
    new route53.CnameRecord(this, 'WorkMailAutodiscover', {
      zone: props.hostedZone,
      recordName: 'autodiscover',
      domainName: 'autodiscover.mail.us-east-1.awsapps.com',
      ttl: cdk.Duration.minutes(5),
    });

    // DKIM records for SES email signing (from context)
    const dkimKeys = this.node.tryGetContext('dkimKeys') || [];
    if (dkimKeys.length !== 3) {
      throw new Error('Three DKIM keys must be provided via context: --context dkimKeys=["key1","key2","key3"]');
    }

    dkimKeys.forEach((key: string, index: number) => {
      new route53.CnameRecord(this, `SesDkim${index + 1}`, {
        zone: props.hostedZone,
        recordName: `${key}._domainkey`,
        domainName: `${key}.dkim.amazonses.com`,
        ttl: cdk.Duration.minutes(5),
      });
    });

    // DMARC record for email security
    new route53.TxtRecord(this, 'DmarcRecord', {
      zone: props.hostedZone,
      recordName: '_dmarc',
      values: [
        'v=DMARC1;p=quarantine;pct=100;fo=1',
      ],
      ttl: cdk.Duration.minutes(5),
    });

    // SES domain verification record (from context)
    const sesVerificationToken = this.node.tryGetContext('sesVerificationToken');
    if (!sesVerificationToken) {
      throw new Error('SES verification token must be provided via context: --context sesVerificationToken=...');
    }

    new route53.TxtRecord(this, 'SesVerification', {
      zone: props.hostedZone,
      recordName: '_amazonses',
      values: [sesVerificationToken],
      ttl: cdk.Duration.minutes(5),
    });
  }
}