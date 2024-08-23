import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  request: NextRequest,
  { params }: { params: { adventureId: string } },
) => {
  const { adventureId } = params;

  if (!adventureId) {
    return new NextResponse("Missing adventure id", { status: 400 });
  }

  try {
    const adventure = await prisma.adventure.findUnique({
      where: {
        id: adventureId,
      },
    });
    return NextResponse.json(adventure);
  } catch (error) {
    const userFacingErrorMessage = "Failed to get adventure";
    console.error(userFacingErrorMessage, error);
    return new NextResponse(userFacingErrorMessage, { status: 500 });
  }
};
