"use server";

import { riddleSubmission } from "@/schemas/riddle";
import { stageAdventureActionClient } from "@/lib/next-safe-action";
import { getStageValidationData } from "@/server/db/stage";
import { getNextStagesWithNextedPreviousStages } from "@/server/db/stage-relation";
import {
  getCountOfIncompletePreviousStages,
  createTeamProgress,
  updateTeamProgress,
} from "@/server/db/team-progress";
import { compareInput } from "@/server/helpers/hashInput";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const verifyStage = stageAdventureActionClient
  .schema(riddleSubmission)
  .metadata({ roleName: "team", actionName: "verify-stage" })
  .action(async ({ parsedInput, ctx }) => {
    const { userId, adventureId, stageId } = ctx;
    const { answer } = parsedInput;

    const stage = await getStageValidationData(stageId);

    if (!stage) {
      return { message: "Stage not found" };
    }

    if (!stage.answer) {
      return { message: "Stage does not have an answer" };
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
              await createTeamProgress(
                userId,
                adventureId,
                nextStage.toStageId,
                now,
              );
            }
          }),
        );

        // Update the user progress entry for the current stage
        await updateTeamProgress(userId, adventureId, stageId, now);

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
