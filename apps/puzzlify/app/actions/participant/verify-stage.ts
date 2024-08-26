"use server";

import { riddleSubmission } from "@/app/schemas/riddle";
import { participantActionClient } from "@/lib/nextSafeAction";
import { getStageValidationData } from "@/server/db/stage";
import { getNextStagesWithNextedPreviousStages } from "@/server/db/stage-relation";
import {
  getCountOfIncompletePreviousStages,
  createUserProgress,
  updateUserProgress,
} from "@/server/db/user-progress";
import { compareInput } from "@/server/helpers/hashInput";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const verifyStage = participantActionClient
  .schema(riddleSubmission)
  .metadata({ roleName: "participant", actionName: "verify-stage" })
  .action(async ({ parsedInput, ctx }) => {
    const { userId, adventureId, stageId } = ctx;
    const { answer } = parsedInput;

    if (!stageId) {
      return { message: "Stage id not provided" };
    }

    if (!adventureId) {
      return { message: "Adventure id not provided" };
    }

    const stage = await getStageValidationData(stageId);

    if (!stage) {
      return { message: "Stage not found" };
    }

    try {
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

        // TODO: Does this revalidate the path for all users or just
        // the current user? Only needs to be the current user
        revalidatePath(`/adventure/${adventureId}/stage`);
      } else {
        return { message: "Incorrect answer. Try again." };
      }
    } catch (error) {
      console.error("Error verifying answer:", error);
      return { message: "An error occurred" };
    }

    redirect(`/adventure/${adventureId}/stage`);
  });
