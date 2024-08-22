"use server";

import prisma from "@/lib/prisma";
import { getUserId } from "@/server/helpers/getUserId";
import { compareInput } from "@/server/helpers/hashInput";
import { getAdventureHost } from "@/server/helpers/isAdventureHost";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { z } from "zod";

type Params = {
  adventureId: string;
  stageId: string;
};

export default async function verify(
  { adventureId, stageId }: Params,
  formData: FormData,
) {
  try {
    const schema = z.object({
      answer: z.string().min(1).toLowerCase(),
    });

    const result = schema.safeParse({
      answer: formData.get("answer"),
    });

    if (!result.success) {
      return { message: "Invalid answer input" };
    }

    const {
      data: { answer },
    } = result;

    const userId = await getUserId();
    const isHost = await getAdventureHost({ adventureId, userId });

    if (isHost) {
      return { message: "You are the host of this adventure" };
    }

    const stage = await prisma.stage.findUnique({
      where: { id: stageId },
      select: { answer: true, id: true, nextStages: true },
    });

    if (!stage) {
      return { message: "Stage not found" };
    }

    const isCorrectAnswer = await compareInput(answer, stage.answer);

    if (isCorrectAnswer) {
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
                completionTime: null,
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
    } else {
      return { message: "Incorrect answer. Try again." };
    }
  } catch (error) {
    console.error("Error verifying answer:", error);
    return { message: "An error occurred" };
  }

  redirect(`/adventure/${adventureId}/dashboard`);
}
