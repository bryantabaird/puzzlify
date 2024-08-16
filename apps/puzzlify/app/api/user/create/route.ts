import { userSchema } from "@/models/user";
import { putItem } from "@/server/helpers/db";
import { AUTH_USER_TABLE_NAME } from "@repo/shared";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  throw new Error("creating new user disabled");

  const { email, password } = await request.json();

  const hashedPassword = await bcrypt.hash(password, 10);

  const id = randomUUID();
  const dateCreated = new Date().toISOString();

  const user = { id, dateCreated, email, hashedPassword };

  const { success, error } = userSchema.safeParse(user);

  if (!success) {
    const errorMessage = "User schema is invalid";
    console.error(errorMessage, error);
    throw new Error(errorMessage);
  }

  try {
    await putItem(user, AUTH_USER_TABLE_NAME);
  } catch (error) {
    const userFacingErrorMessage = "Failed to add user";
    console.error(userFacingErrorMessage, error);
    return new NextResponse(userFacingErrorMessage, { status: 500 });
  }

  return new NextResponse("User has been added", { status: 201 });
};
