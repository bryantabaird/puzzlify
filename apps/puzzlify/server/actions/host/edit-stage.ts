"use server";

import { stageSchema } from "@/schemas/stage";
import { hostStageActionClient } from "@/lib/next-safe-action";
import { updateStageDb } from "@/server/db/stage";
import hashInput from "@/server/helpers/hashInput";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const editStage = hostStageActionClient
  .schema(stageSchema)
  .metadata({ roleName: "host", actionName: "edit-stage" })
  .action(async ({ parsedInput, ctx: { adventureId, stageId } }) => {
    const { riddle, answer, label } = parsedInput;

    const hashedAnswer = answer ? await hashInput(answer) : null;

    try {
      await updateStageDb(stageId, { label, riddle, answer: hashedAnswer });

      revalidatePath(`/adventure/${adventureId}`);
    } catch (error) {
      const userFacingErrorMessage = "Failed to edit stage";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    redirect(`/adventure/${adventureId}/stage`);
  });
