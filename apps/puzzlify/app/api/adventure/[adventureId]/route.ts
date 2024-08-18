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

export const PATCH = async (
  request: NextRequest,
  { params }: { params: { adventureId: string } },
) => {
  const { name, startDate } = await request.json();
  const { adventureId } = params;

  try {
    const updatedAdventure = await prisma.adventure.update({
      where: { id: adventureId },
      data: {
        ...(name && { name }),
        ...(startDate && { startDate }),
      },
    });

    return NextResponse.json(updatedAdventure);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update adventure" });
  }
};
