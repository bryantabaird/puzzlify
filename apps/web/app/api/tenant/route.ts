import { addTenant } from "./addTenant";
import { addUserGroup } from "./addUserGroup";

export async function POST(req: Request) {
  const { tenantName } = await req.json();

  try {
    const tenant = await addTenant(tenantName);
    await addUserGroup({ groupName: tenantName });
    return Response.json({ data: tenant });
  } catch (error) {
    console.error("Error adding tenant", error);
    return Response.json({ error: "Failed to add tenant" }, { status: 500 });
  }
}

export async function PUT() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return Response.json({ message: "PUT: Hello, world!" });
}

export async function DELETE() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return Response.json({ message: "DELETE: Hello, world!" });
}
