"use server";

import { stageSchema } from "@/schemas/stage";
import { hostActionClient } from "@/lib/nextSafeAction";
import { updateStageDb } from "@/server/db/stage";
import hashInput from "@/server/helpers/hashInput";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const editStage = hostActionClient
  .schema(stageSchema)
  .metadata({ roleName: "host", actionName: "edit-stage" })
  .action(async ({ parsedInput, bindArgsParsedInputs }) => {
    const { riddle, answer, label } = parsedInput;

    const hashedAnswer = answer ? await hashInput(answer) : null;
    const [{ adventureId, stageId }] = bindArgsParsedInputs;

    if (!adventureId) {
      throw new Error("Adventure ID is required");
    }

    if (!stageId) {
      throw new Error("Stage ID is required");
    }

    try {
      await updateStageDb(stageId, { label, riddle, answer: hashedAnswer });

      revalidatePath(`/adventure/${adventureId}`);
    } catch (error) {
      const userFacingErrorMessage = "Failed to edit stage";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    redirect(`/adventure/${adventureId}`);
  });
