import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { TENANT_TABLE_NAME } from "@repo/shared";

const client = new DynamoDBClient({
  endpoint: "http://localhost:4566",
  region: "us-west-2",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

const documentClient = DynamoDBDocumentClient.from(client);

type TableName = typeof TENANT_TABLE_NAME;

export const putItem = async (item: any, tableName: TableName) => {
  try {
    await documentClient.send(
      new PutCommand({
        TableName: tableName,
        Item: item,
      }),
    );
  } catch (error) {
    console.error("Error adding tenant", error);
    throw new Error("Failed to add tenant");
  }
};
