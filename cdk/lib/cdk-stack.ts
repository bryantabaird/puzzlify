import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

import {
  TENANT_TABLE_NAME,
  AUTH_USER_TABLE_NAME,
  ADVENTURE_TABLE_NAME,
} from "@repo/shared";
import { AssetStorage } from "../constructs/asset-storage";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new AssetStorage(this, "AssetStorage");
  }
}
