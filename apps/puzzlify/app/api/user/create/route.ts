import { userSchema } from "@/models/user";
import { putItem } from "@/server/helpers/db";
import { USER_TABLE_NAME } from "@repo/shared";
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  const { username, email, password } = await request.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  const dateCreated = new Date().toISOString();
  const id = randomUUID();

  const user = { username, id, dateCreated, email, hashedPassword };

  const { success, error } = userSchema.safeParse(user);

  if (!success) {
    const errorMessage = "User schema is invalid";
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }

  try {
    await putItem(user, USER_TABLE_NAME);
  } catch (error) {
    const userFacingErrorMessage = "Failed to add user";
    console.error(userFacingErrorMessage, error);
    return new NextResponse(userFacingErrorMessage, { status: 500 });
  }

  return new NextResponse("User has been added", { status: 201 });
};
