import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export const POST = async (
  req: NextApiRequest,
  { params }: { params: { adventureId: string } },
) => {
  const session = await auth();

  const user = session?.user;

  if (!user || !user.id) {
    console.error("Error retrieving user from session");
    return new NextResponse("Internal server error", { status: 500 });
  }

  const userId = user.id;

  if (!userId) {
    console.error("Error retrieving user from session");
    return new NextResponse("Internal server error", { status: 500 });
  }

  const adventureId = params.adventureId;

  try {
    const stagesWithoutPrevious = await prisma.stage.findMany({
      where: {
        adventureId: adventureId,
        previousStages: { none: {} },
      },
    });

    const userProgressEntries = stagesWithoutPrevious.map((stage) => ({
      userId: userId,
      adventureId: adventureId,
      stageId: stage.id,
    }));

    await prisma.userProgress.createMany({
      data: userProgressEntries,
    });

    return NextResponse.json(
      { message: "User successfully joined the adventure" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error joining adventure", error);
    return NextResponse.json(
      { error: "An error occurred while joining the adventure" },
      { status: 500 },
    );
  }
};
