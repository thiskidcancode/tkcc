import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cr from 'aws-cdk-lib/custom-resources';
import { Construct } from 'constructs';

export interface GitHubIntegrationProps {
  environment: 'staging' | 'production';
  s3BucketName: string;
  cloudFrontDistributionId: string;
  awsRoleArn: string;
}

export class GitHubIntegration extends Construct {
  constructor(scope: Construct, id: string, props: GitHubIntegrationProps) {
    super(scope, id);

    const updateGitHubVars = new lambda.Function(this, 'UpdateGitHubVars', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromInline(`
        const https = require('https');
        
        exports.handler = async (event) => {
          const { environment, s3BucketName, cloudFrontDistributionId, awsRoleArn } = event.ResourceProperties;
          
          const variables = {
            S3_BUCKET_NAME: s3BucketName,
            CLOUDFRONT_DISTRIBUTION_ID: cloudFrontDistributionId,
            AWS_ROLE_ARN: awsRoleArn
          };
          
          for (const [key, value] of Object.entries(variables)) {
            await updateGitHubSecret(environment, key, value);
          }
          
          return { PhysicalResourceId: \`github-vars-\${environment}\` };
        };
        
        async function updateGitHubSecret(environment, name, value) {
          // GitHub API call to update environment secret
          console.log(\`Updating \${environment} environment: \${name} = \${value}\`);
        }
      `),
      environment: {
        GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
        GITHUB_REPO: 'thiskidcancode/tkcc'
      }
    });

    new cr.AwsCustomResource(this, 'GitHubVarsUpdater', {
      onCreate: {
        service: 'Lambda',
        action: 'invoke',
        parameters: {
          FunctionName: updateGitHubVars.functionName,
          Payload: JSON.stringify({
            ResourceProperties: {
              environment: props.environment,
              s3BucketName: props.s3BucketName,
              cloudFrontDistributionId: props.cloudFrontDistributionId,
              awsRoleArn: props.awsRoleArn
            }
          })
        }
      },
      onUpdate: {
        service: 'Lambda',
        action: 'invoke',
        parameters: {
          FunctionName: updateGitHubVars.functionName,
          Payload: JSON.stringify({
            ResourceProperties: {
              environment: props.environment,
              s3BucketName: props.s3BucketName,
              cloudFrontDistributionId: props.cloudFrontDistributionId,
              awsRoleArn: props.awsRoleArn
            }
          })
        }
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: cr.AwsCustomResourcePolicy.ANY_RESOURCE
      })
    });
  }
}