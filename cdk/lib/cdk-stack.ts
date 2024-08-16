import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

import { TENANT_TABLE_NAME, USER_TABLE_NAME } from "@repo/shared";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a DynamoDB table for tenants
    new dynamodb.Table(this, "Tenant", {
      tableName: TENANT_TABLE_NAME,
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
    });

    new dynamodb.Table(this, "User", {
      tableName: USER_TABLE_NAME,
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.STRING,
      },
    });
  }
}
