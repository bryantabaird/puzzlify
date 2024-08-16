import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { TENANT_TABLE_NAME, USER_TABLE_NAME } from "@repo/shared";
import { awsCredentialsProvider } from "@vercel/functions/oidc";

const AWS_ROLE_ARN = process.env.AWS_ROLE_ARN;
const AWS_REGION = process.env.AWS_REGION;

if (!AWS_ROLE_ARN) {
  throw new Error("AWS_ROLE_ARN is not defined");
}

if (!AWS_REGION) {
  throw new Error("AWS_REGION is not defined");
}

const client = new DynamoDBClient({
  region: AWS_REGION,
  credentials: awsCredentialsProvider({
    roleArn: AWS_ROLE_ARN,
  }),
});

const documentClient = DynamoDBDocumentClient.from(client);

type TableName = typeof TENANT_TABLE_NAME | typeof USER_TABLE_NAME;

export const putItem = async (
  item: Record<string, unknown>,
  tableName: TableName,
) => {
  console.log("Adding item", item);
  try {
    await documentClient.send(
      new PutCommand({
        TableName: tableName,
        Item: item,
      }),
    );
  } catch (error) {
    console.error("Error adding item", error);
    throw new Error("Failed to add item");
  }
};
