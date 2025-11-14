import * as cdk from "aws-cdk-lib";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import { Construct } from "constructs";

export class DnsStack extends cdk.Stack {
  public readonly hostedZone: route53.IHostedZone;
  public readonly certificate: acm.ICertificate;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create hosted zone for thiskidcancode.com
    this.hostedZone = new route53.HostedZone(this, "TkccHostedZone", {
      zoneName: "thiskidcancode.com",
      comment: "Hosted zone for ThisKidCanCode platform",
    });



    // Import existing certificate from context
    const certificateArn = this.node.tryGetContext("certificateArn");
    if (!certificateArn) {
      throw new Error(
        "Certificate ARN must be provided via context: --context certificateArn=arn:aws:acm:..."
      );
    }

    this.certificate = acm.Certificate.fromCertificateArn(
      this,
      "ImportedCert",
      certificateArn
    );

    // Output the name servers for DNS delegation
    new cdk.CfnOutput(this, "NameServers", {
      value: cdk.Fn.join(", ", this.hostedZone.hostedZoneNameServers!),
      description: "Name servers for DNS delegation",
    });

    // Output the hosted zone ID
    new cdk.CfnOutput(this, "HostedZoneId", {
      value: this.hostedZone.hostedZoneId,
      description: "Route 53 Hosted Zone ID",
    });

    // Output the certificate ARN
    new cdk.CfnOutput(this, 'CertificateArn', {
      value: this.certificate.certificateArn,
      description: 'SSL Certificate ARN',
    });
  }
}
