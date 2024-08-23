import prisma from "@/lib/prisma";
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
