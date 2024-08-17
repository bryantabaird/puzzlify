import { putItem } from "@/server/helpers/db";
import { ADVENTURE_TABLE_NAME } from "@repo/shared";
import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { adventureSchema } from "@/models/adventure";

export const POST = async (request: NextRequest) => {
  const userInput = await request.json();

  const id = randomUUID();
  const dateCreated = new Date().toISOString();

  const adventure = { id, dateCreated, ...userInput };

  const { success, error } = adventureSchema.safeParse(adventure);

  if (!success) {
    const errorMessage = "Adventure schema is invalid";
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }

  try {
    await putItem(adventure, ADVENTURE_TABLE_NAME);
  } catch (error) {
    const userFacingErrorMessage = "Failed to add adventure";
    console.error(userFacingErrorMessage, error);
    return new NextResponse(userFacingErrorMessage, { status: 500 });
  }

  return new NextResponse(JSON.stringify(adventure), { status: 200 });
};
