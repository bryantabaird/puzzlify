"use server";

import { stageSchema } from "@/schemas/stage";
import { hostActionClient } from "@/lib/nextSafeAction";
import { createStageDb } from "@/server/db/stage";
import hashInput from "@/server/helpers/hashInput";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createStage = hostActionClient
  .schema(stageSchema)
  .metadata({ roleName: "host", actionName: "create-stage" })
  .action(async ({ parsedInput, bindArgsParsedInputs }) => {
    const { riddle, answer } = parsedInput;
    const { adventureId } = bindArgsParsedInputs[0];

    const hashedAnswer = await hashInput(answer);

    if (!adventureId) {
      throw new Error("Adventure ID is required");
    }

    const stage = { adventureId, riddle, answer: hashedAnswer };

    try {
      await createStageDb(stage);

      revalidatePath(`/adventure/${adventureId}`);
    } catch (error) {
      const userFacingErrorMessage = "Failed to add stage";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    redirect(`/adventure/${adventureId}`);
  });
