import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/server/helpers/getUserId";
import { getAdventureHost } from "@/server/helpers/isAdventureHost";

export const POST = async (
  request: NextRequest,
  { params }: { params: { adventureId: string; stageId: string } },
) => {
  const adventureId = params.adventureId;
  const userId = await getUserId();
  const isHost = await getAdventureHost({ adventureId, userId });

  if (!isHost) {
    return new NextResponse("You are not the host of this adventure", {
      status: 403,
    });
  }

  const userInput = await request.json();

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
