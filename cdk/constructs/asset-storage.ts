import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";

/**
 * openssl genpkey -algorithm RSA -out private_key.pem
 * openssl rsa -pubout -in private_key.pem -out public_key.pem
 *
 * Generate the public / private key pair, and upload the public
 * key to CloudFront. Private key to be used to sign urls
 */
const PUBLIC_KEY_ID = "K10SXXCDTNL72X";

export class AssetStorage extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    // 1. Create an S3 Bucket for storing stage images (Private)
    const stageImagesBucket = new s3.Bucket(this, "StageImagesBucket", {
      bucketName: "adventure-app-stage-images",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    // 2. Create a CloudFront Key Group
    const keyGroup = new cloudfront.KeyGroup(this, "CloudFrontKeyGroup", {
      items: [
        cloudfront.PublicKey.fromPublicKeyId(
          this,
          "CloudFrontPublicKey",
          PUBLIC_KEY_ID,
        ),
      ],
    });

    // 3. Create an Origin Access Identity for CloudFront
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "OAI",
    );

    // 4. Grant CloudFront access to the S3 bucket
    stageImagesBucket.grantRead(originAccessIdentity);

    // 5. Create the CloudFront distribution
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "StageImagesDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: stageImagesBucket,
              originAccessIdentity: originAccessIdentity,
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                maxTtl: cdk.Duration.days(1),
                // TODO: Invalidate cache on host edit of image
                defaultTtl: cdk.Duration.hours(1),
                compress: true,
                viewerProtocolPolicy:
                  cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                allowedMethods: cloudfront.CloudFrontAllowedMethods.GET_HEAD,
                cachedMethods:
                  cloudfront.CloudFrontAllowedCachedMethods.GET_HEAD,
                forwardedValues: {
                  queryString: true,
                  cookies: { forward: "none" },
                },
                trustedKeyGroups: [keyGroup],
              },
            ],
          },
        ],
      },
    );

    // 6. Output the S3 bucket name and CloudFront distribution URL
    new cdk.CfnOutput(this, "StageImagesBucketName", {
      value: stageImagesBucket.bucketName,
    });

    new cdk.CfnOutput(this, "CloudFrontDistributionUrl", {
      value: distribution.distributionDomainName,
    });
  }
}
