import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";

import { TENANT_TABLE_NAME } from "@repo/shared";
import { tenantSchema } from "./type";

const client = new DynamoDBClient({
  endpoint: "http://localhost:4566",
  region: "us-east-1",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

const documentClient = DynamoDBDocumentClient.from(client);

export async function POST(req: Request) {
  const { organizationName } = await req.json();

  const id = randomUUID();
  const dateCreated = new Date().toISOString();

  const tenant = { organizationName, id, dateCreated };

  const { success, error } = tenantSchema.safeParse(tenant);

  if (!success) {
    const errorMessage = "Tenant schema is invalid";
    console.error(errorMessage, error);
    return Response.json({ error: errorMessage }, { status: 400 });
  }

  try {
    await documentClient.send(
      new PutCommand({
        TableName: TENANT_TABLE_NAME,
        Item: tenant,
      }),
    );
  } catch (error) {
    console.error("Error adding tenant", error);
    return Response.json({ error: "Failed to add tenant" }, { status: 500 });
  }

  return Response.json({ data: tenant });
}

export async function PUT() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return Response.json({ message: "PUT: Hello, world!" });
}

export async function DELETE() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return Response.json({ message: "DELETE: Hello, world!" });
}
