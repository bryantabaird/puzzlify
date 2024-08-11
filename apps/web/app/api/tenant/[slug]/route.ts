import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

import { TENANT_TABLE_NAME } from "@repo/shared";
import { tenantIdRequiredSchema, tenantSchema } from "../type";

const client = new DynamoDBClient({
  endpoint: "http://localhost:4566",
  region: "us-east-1",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

const documentClient = DynamoDBDocumentClient.from(client);

export async function GET(
  _: Request,
  { params }: { params: { slug: string } },
) {
  const tenantId = params.slug;

  console.log("params", params);
  console.log("tenantId", tenantId);

  const { success, error } = tenantIdRequiredSchema.safeParse({ id: tenantId });

  if (!success) {
    const errorMessage = "Tenant ID is invalid";
    console.error(errorMessage, error);
    return new Response(errorMessage, { status: 400 });
  }

  try {
    const { Item: tenant } = await documentClient.send(
      new GetCommand({
        TableName: TENANT_TABLE_NAME,
        Key: { id: tenantId },
      }),
    );

    if (!tenant) {
      return new Response("Not found", { status: 404 });
    }

    const { success, error } = tenantSchema.safeParse(tenant);

    if (!success) {
      const errorMessage = "Tenant schema is invalid";
      console.error(errorMessage, error);
      return new Response(errorMessage, { status: 500 });
    }

    return Response.json({ data: tenant });
  } catch (error) {
    console.error("Error getting tenant", error);
    return new Response("Failed to get tenant", { status: 500 });
  }
}
