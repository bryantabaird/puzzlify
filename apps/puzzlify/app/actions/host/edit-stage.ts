"use server";

import { stageSchema } from "@/app/schemas/stage";
import { hostActionClient } from "@/lib/nextSafeAction";
import { updateStageDb } from "@/server/db/stage";
import hashInput from "@/server/helpers/hashInput";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const editStage = hostActionClient
  .schema(stageSchema)
  .metadata({ actionName: "edit-stage" })
  .action(async ({ parsedInput, bindArgsParsedInputs }) => {
    const { riddle, answer } = parsedInput;

    const hashedAnswer = await hashInput(answer);
    const [{ adventureId, stageId }] = bindArgsParsedInputs;

    if (!adventureId) {
      throw new Error("Adventure ID is required");
    }

    if (!stageId) {
      throw new Error("Stage ID is required");
    }

    try {
      await updateStageDb(stageId, { riddle, answer: hashedAnswer });

      revalidatePath(`/adventure/${adventureId}`);
    } catch (error) {
      const userFacingErrorMessage = "Failed to edit stage";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    redirect(`/adventure/${adventureId}`);
  });
