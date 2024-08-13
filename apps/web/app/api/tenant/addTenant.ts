import { randomUUID } from "crypto";

import { tenantSchema } from "./type";
import { putItem } from "../helpers/db";
import { TENANT_TABLE_NAME } from "@repo/shared";

export const addTenant = async (req: Request) => {
  const { tenantName } = await req.json();

  const id = randomUUID();
  const dateCreated = new Date().toISOString();

  const tenant = { tenantName, id, dateCreated };

  const { success, error } = tenantSchema.safeParse(tenant);

  if (!success) {
    const errorMessage = "Tenant schema is invalid";
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }

  try {
    await putItem(tenant, TENANT_TABLE_NAME);
  } catch (error) {
    const errorMessage = "Failed to add tenant";
    console.error("Error adding tenant", error);
    throw new Error(errorMessage);
  }

  return tenant;
};
