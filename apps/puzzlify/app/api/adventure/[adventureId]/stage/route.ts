import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserId } from "@/server/helpers/getUserId";
import { getAdventureHost } from "@/server/helpers/isAdventureHost";

export const POST = async (
  request: NextRequest,
  { params }: { params: { adventureId: string } },
) => {
  const userId = await getUserId();
  const isHost = await getAdventureHost({
    adventureId: params.adventureId,
    userId,
  });

  if (!isHost) {
    return new NextResponse("You are not the host of this adventure", {
      status: 403,
    });
  }

  const adventureId = params.adventureId;

  if (!adventureId) {
    console.error("Error retrieving adventure id from params");
    return new NextResponse("Internal server error", { status: 500 });
  }

  const userInput = await request.json();

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
