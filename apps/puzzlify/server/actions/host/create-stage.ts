"use server";

import { stageSchema } from "@/schemas/stage";
import { hostActionClient } from "@/lib/nextSafeAction";
import { createStageDb } from "@/server/db/stage";
import hashInput from "@/server/helpers/hashInput";
import { revalidatePath } from "next/cache";

export const createStage = hostActionClient
  .schema(stageSchema)
  .metadata({ roleName: "host", actionName: "create-stage" })
  .action(async ({ parsedInput, bindArgsParsedInputs }) => {
    const { riddle, answer, label } = parsedInput;
    const { adventureId } = bindArgsParsedInputs[0];

    const hashedAnswer = answer ? await hashInput(answer) : null;

    if (!adventureId) {
      throw new Error("Adventure ID is required");
    }

    const stagePayload = { label, adventureId, riddle, answer: hashedAnswer };

    try {
      const stage = await createStageDb(stagePayload);
      revalidatePath(`/adventure/${adventureId}`);

      return { stageId: stage.id };
    } catch (error) {
      const userFacingErrorMessage = "Failed to add stage";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }
  });
