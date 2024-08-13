import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as s3 from "aws-cdk-lib/aws-s3";

import { TENANT_TABLE_NAME } from "@repo/shared";
import { CognitoConstruct } from "../constructs/cognito-user";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the cognito resources
    new CognitoConstruct(this, "CognitoConstruct");

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
