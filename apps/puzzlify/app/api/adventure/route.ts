import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";

export const POST = async (request: NextRequest) => {
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

  const adventure = { name: userInput.name, hostId: userId };

  try {
    const createdAdventure = await prisma.adventure.create({
      data: adventure,
    });
    console.log("Adventure created:", createdAdventure);
    return NextResponse.json(createdAdventure);
  } catch (error) {
    const userFacingErrorMessage = "Failed to add adventure";
    console.error(userFacingErrorMessage, error);
    return new NextResponse(userFacingErrorMessage, { status: 500 });
  }
};
