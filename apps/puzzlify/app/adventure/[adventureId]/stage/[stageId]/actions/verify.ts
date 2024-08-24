"use server";

import { getStageValidationData } from "@/server/db/stage";
import { getNextStagesWithNextedPreviousStages } from "@/server/db/stage-relation";
import {
  createUserProgress,
  getCountOfIncompletePreviousStages,
  updateUserProgress,
} from "@/server/db/user-progress";
import { getUserId } from "@/server/helpers/getUserId";
import { compareInput } from "@/server/helpers/hashInput";
import { isAdventureHost } from "@/server/helpers/isAdventureHost";
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
    const isHost = await isAdventureHost({ adventureId, userId });

    if (isHost) {
      return { message: "You are the host of this adventure" };
    }

    const stage = await getStageValidationData(stageId);

    if (!stage) {
      return { message: "Stage not found" };
    }

    const isCorrectAnswer = await compareInput(answer, stage.answer);

    if (isCorrectAnswer) {
      const now = new Date();

      const nextStages = await getNextStagesWithNextedPreviousStages(stageId);

      // TODO: Transaction for the following operations
      await Promise.all(
        nextStages.map(async (nextStage) => {
          const previousStageIds = nextStage.toStage.previousStages.map(
            (stageRelation) => stageRelation.fromStageId,
          );

          const incompletePreviousStagesCount =
            await getCountOfIncompletePreviousStages(
              adventureId,
              userId,
              previousStageIds,
            );

          if (incompletePreviousStagesCount === 0) {
            await createUserProgress(
              userId,
              adventureId,
              nextStage.toStageId,
              now,
            );
          }
        }),
      );

      // Update the user progress entry for the current stage
      await updateUserProgress(userId, adventureId, stageId, now);

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
