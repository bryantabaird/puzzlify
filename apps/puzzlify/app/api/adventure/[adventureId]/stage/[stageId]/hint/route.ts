import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const POST = async (
  request: NextRequest,
  { params }: { params: { stageId: string } },
) => {
  const userInput = await request.json();
  const session = await auth();

  const user = session?.user;

  if (!user) {
    console.error("Error retrieving user from session");
    return new NextResponse("Internal server error", { status: 500 });
  }

  const userId = user.id;

  if (!userId) {
    console.error("Error retrieving user id from session");
    return new NextResponse("Internal server error", { status: 500 });
  }

  const stageId = params.stageId;

  if (!stageId) {
    console.error("Error retrieving adventure id from params");
    return new NextResponse("Internal server error", { status: 500 });
  }

  const hint = {
    stageId,
    delay: userInput.delay,
    hint: userInput.hint,
  };

  try {
    const createdHint = await prisma.hint.create({
      data: hint,
    });
    console.log("Hint created:", createdHint);
    return NextResponse.json(createdHint);
  } catch (error) {
    const userFacingErrorMessage = "Failed to add hint";
    console.error(userFacingErrorMessage, error);
    return new NextResponse(userFacingErrorMessage, { status: 500 });
  }
};
