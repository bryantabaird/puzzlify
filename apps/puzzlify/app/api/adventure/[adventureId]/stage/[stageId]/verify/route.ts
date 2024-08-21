import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // Adjust the import path according to your project structure
import { getUserId } from "@/server/helpers/getUserId";
import { getAdventureHost } from "@/server/helpers/isAdventureHost";
import hashInput from "@/server/helpers/hashInput";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const POST = async (
  request: Request,
  {
    params: { adventureId, stageId },
  }: { params: { adventureId: string; stageId: string } },
) => {
  try {
    const userId = await getUserId();
    const isHost = await getAdventureHost({ adventureId, userId });

    if (isHost) {
      return NextResponse.json(
        { message: "You are the host of this adventure" },
        { status: 403 },
      );
    }

    const { answer } = await request.json();

    if (typeof answer !== "string" || answer.trim() === "") {
      return NextResponse.json(
        { message: "Invalid answer input" },
        { status: 400 },
      );
    }

    const stage = await prisma.stage.findUnique({
      where: { id: stageId },
      select: { answer: true, id: true, nextStages: true },
    });

    if (!stage) {
      return NextResponse.json({ message: "Stage not found" }, { status: 404 });
    }
    const parsedAnswer = answer.toLowerCase();
    const hashedAnswer = await hashInput(parsedAnswer);

    if (answer === stage.answer) {
      const now = new Date();

      const nextStages = await prisma.stageRelation.findMany({
        where: {
          fromStageId: stage.id,
        },
        select: {
          toStageId: true,
          toStage: {
            select: {
              previousStages: {
                where: {
                  fromStageId: { not: stage.id },
                },
                select: {
                  fromStageId: true,
                },
              },
            },
          },
        },
      });

      await Promise.all(
        nextStages.map(async (nextStage) => {
          const previousStageIds = nextStage.toStage.previousStages.map(
            (stageRelation) => stageRelation.fromStageId,
          );

          const incompletePreviousStagesCount = await prisma.userProgress.count(
            {
              where: {
                userId,
                adventureId,
                stageId: { in: previousStageIds },
                completionTime: null, // Uncompleted stages
              },
            },
          );

          if (incompletePreviousStagesCount === 0) {
            await prisma.userProgress.create({
              data: {
                userId,
                adventureId,
                stageId: nextStage.toStageId,
                startTime: now,
              },
            });
          }
        }),
      );

      // Update the user progress entry for the current stage
      await prisma.userProgress.update({
        where: {
          userProgressId: {
            userId,
            adventureId,
            stageId,
          },
        },
        data: { completionTime: now },
      });

      revalidatePath(`/adventure/${adventureId}/dashboard`);

      return NextResponse.json({ message: "Correct answer!" });
    } else {
      return NextResponse.json(
        { message: "Incorrect answer. Try again." },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error verifying answer:", error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
};
