import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";

import { TENANT_TABLE_NAME } from "@repo/shared";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define an S3 bucket
    new s3.Bucket(this, "MyBucket", {
      bucketName: "my-cdk-bucket",
      versioned: true, // Enable versioning for the bucket
    });

    // Create a DynamoDB table for tenants
    new dynamodb.Table(this, "Tenant", {
      tableName: TENANT_TABLE_NAME,
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
    });
  }
}
