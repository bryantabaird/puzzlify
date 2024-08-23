import { NextRequest, NextResponse } from "next/server";
import hashInput from "@/server/helpers/hashInput";
import { createUser } from "@/server/db/user";

export const POST = async (request: NextRequest) => {
  const { email, password } = await request.json();

  const hashedPassword = await hashInput(password);

  const user = { email, password: hashedPassword };

  try {
    const createdUser = await createUser(user);
    console.log("User has been added:", createdUser);
    return new NextResponse("User has been added", { status: 201 });
  } catch (error) {
    const userFacingErrorMessage = "Failed to add user";
    console.error(userFacingErrorMessage, error);
    return new NextResponse(userFacingErrorMessage, { status: 500 });
  }
};
