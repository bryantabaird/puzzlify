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
const BUCKET_NAME = "adventure-app-puzzle-images";

export class AssetStorage extends Construct {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id);

    const puzzleImagesBucket = new s3.Bucket(this, "PuzzleImagesBucket", {
      bucketName: BUCKET_NAME,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      versioned: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.PUT],
          allowedOrigins: ["http://localhost:3000"],
          allowedHeaders: ["*"],
        },
      ],
    });

    const keyGroup = new cloudfront.KeyGroup(this, "CloudFrontKeyGroup", {
      items: [
        cloudfront.PublicKey.fromPublicKeyId(
          this,
          "CloudFrontPublicKey",
          PUBLIC_KEY_ID,
        ),
      ],
    });

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "OAI",
    );

    puzzleImagesBucket.grantRead(originAccessIdentity);

    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "PuzzleImagesDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: puzzleImagesBucket,
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

    new cdk.CfnOutput(this, "PuzzleImagesBucketName", {
      value: puzzleImagesBucket.bucketName,
    });

    new cdk.CfnOutput(this, "CloudFrontDistributionUrl", {
      value: distribution.distributionDomainName,
    });
  }
}
