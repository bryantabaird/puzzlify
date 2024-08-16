import { userSchema } from "@/models/user";
import { putItem } from "@/server/helpers/db";
import { USER_TABLE_NAME } from "@repo/shared";
import { NextApiRequest } from "next";
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export const POST = async (request: NextApiRequest) => {
  const { username, email, password } = request.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const id = randomUUID();
  const dateCreated = new Date().toISOString();

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

export const DELETE = async (request: NextApiRequest) => {
  const { id } = request.body;

  try {
    await deleteItem(id, USER_TABLE_NAME);
  } catch (error) {
    const userFacingErrorMessage = "Failed to delete user";
    console.error(userFacingErrorMessage, error);
    return new NextResponse(userFacingErrorMessage, { status: 500 });
  }

  return new NextResponse("User has been deleted", { status: 200 });
};
