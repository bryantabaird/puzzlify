"use server";

import { hostAdventureActionClient } from "@/lib/next-safe-action";
import { createStageDb } from "@/server/db/stage";
import hashInput from "@/server/helpers/hashInput";
import { revalidatePath } from "next/cache";
import { puzzleFormSchema } from "@/schemas/puzzle";
import { createHintDb } from "@/server/db/hint";

export const createPuzzle = hostAdventureActionClient
  .schema(puzzleFormSchema)
  .metadata({ roleName: "host", actionName: "create-puzzle" })
  .action(async ({ parsedInput, ctx: { adventureId } }) => {
    const { riddle, answer, label, assets, hints } = parsedInput;

    const hashedAnswer = answer ? await hashInput(answer) : null;

    const stagePayload = { label, adventureId, riddle, answer: hashedAnswer };

    try {
      const { id: stageId } = await createStageDb(stagePayload);

      await Promise.all(
        hints.map(async ({ hint, delay }) => {
          await createHintDb({ stageId, hint, delay });
        }),
      );

      revalidatePath(`/adventure/${adventureId}`);

      return { stageId };
    } catch (error) {
      const userFacingErrorMessage = "Failed to add puzzle";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }
  });
