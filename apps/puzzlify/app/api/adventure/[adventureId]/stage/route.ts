import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const POST = async (
  request: NextRequest,
  { params }: { params: { adventureId: string } },
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

  const adventureId = params.adventureId;

  if (!adventureId) {
    console.error("Error retrieving adventure id from params");
    return new NextResponse("Internal server error", { status: 500 });
  }

  const stage = {
    adventureId,
    riddle: userInput.riddle,
    answer: userInput.answer,
  };

  try {
    const createdStage = await prisma.stage.create({
      data: stage,
    });
    console.log("Stage created:", createdStage);
    return NextResponse.json(createdStage);
  } catch (error) {
    const userFacingErrorMessage = "Failed to add stage";
    console.error(userFacingErrorMessage, error);
    return new NextResponse(userFacingErrorMessage, { status: 500 });
  }
};
