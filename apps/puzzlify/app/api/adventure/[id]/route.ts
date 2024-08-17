import { getItem } from "@/server/helpers/db";
import { ADVENTURE_TABLE_NAME } from "@repo/shared";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const adventureId = searchParams.get("id");

  if (!adventureId) {
    return new NextResponse("Missing adventure id", { status: 400 });
  }

  try {
    const adventure = await getItem(adventureId, ADVENTURE_TABLE_NAME);
    return NextResponse.json(adventure);
  } catch (error) {
    const userFacingErrorMessage = "Failed to get adventure";
    console.error(userFacingErrorMessage, error);
    return new NextResponse(userFacingErrorMessage, { status: 500 });
  }
};
