"use server";

import { stageSchema } from "@/schemas/stage";
import { hostAdventureActionClient } from "@/lib/next-safe-action";
import { createStageDb } from "@/server/db/stage";
import hashInput from "@/server/helpers/hashInput";
import { revalidatePath } from "next/cache";

export const createStage = hostAdventureActionClient
  .schema(stageSchema)
  .metadata({ roleName: "host", actionName: "create-stage" })
  .action(async ({ parsedInput, ctx: { adventureId } }) => {
    const { riddle, answer, label } = parsedInput;

    const hashedAnswer = answer ? await hashInput(answer) : null;

    const stagePayload = { label, adventureId, riddle, answer: hashedAnswer };

    try {
      // TODO: Remove in favor of the new createPuzzle flow
      // @ts-expect-error
      const stage = await createStageDb(stagePayload);
      revalidatePath(`/adventure/${adventureId}`);

      return { stageId: stage.id };
    } catch (error) {
      const userFacingErrorMessage = "Failed to add stage";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }
  });
