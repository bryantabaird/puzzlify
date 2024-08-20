import prisma from "@/lib/prisma";
import { Hint } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

// Get stage details
export const GET = async (
  request: NextRequest,
  { params }: { params: { adventureId: string; stageId: string } },
) => {
  const { adventureId, stageId } = params;

  if (!adventureId || !stageId) {
    return new NextResponse("Missing adventure id or stage id", {
      status: 400,
    });
  }

  try {
    const stage = await prisma.stage.findUnique({
      where: {
        id: stageId,
      },
      include: {
        hints: true, // Include hints if needed
      },
    });

    if (!stage) {
      return new NextResponse("Stage not found", { status: 404 });
    }

    return NextResponse.json(stage);
  } catch (error) {
    const userFacingErrorMessage = "Failed to get stage";
    console.error(userFacingErrorMessage, error);
    return new NextResponse(userFacingErrorMessage, { status: 500 });
  }
};

// Update stage details
export const PATCH = async (
  request: NextRequest,
  { params }: { params: { stageId: string } },
) => {
  const { riddle, answer, hints } = await request.json();
  const { stageId } = params;

  try {
    // Update the stage with hints
    const updatedStage = await prisma.stage.update({
      where: { id: stageId },
      data: {
        riddle,
        answer,
        hints: {
          deleteMany: {},
          createMany: {
            data: hints.map((hint: Hint) => ({
              hint: hint.hint,
              delay: hint.delay,
            })),
          },
        },
      },
      include: { hints: true }, // Include hints in the response
    });

    return NextResponse.json(updatedStage);
  } catch (error) {
    console.error("Failed to update stage", error);
    return new NextResponse("Failed to update stage", { status: 500 });
  }
};
