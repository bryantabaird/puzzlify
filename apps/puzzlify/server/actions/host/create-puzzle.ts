"use server";

import { hostAdventureActionClient } from "@/lib/next-safe-action";
import { createPuzzleDb } from "@/server/db/puzzle";
import hashInput from "@/server/helpers/hashInput";
import { revalidatePath } from "next/cache";
import { puzzleFormSchema } from "@/schemas/puzzle";
import { createHintDb } from "@/server/db/hint";

export const createPuzzle = hostAdventureActionClient
  .schema(puzzleFormSchema)
  .metadata({ roleName: "host", actionName: "create-puzzle" })
  .action(async ({ parsedInput, ctx: { hostAdventureId } }) => {
    const { riddle, answer, label, assets, hints } = parsedInput;

    const hashedAnswer = answer ? await hashInput(answer) : null;

    const puzzlePayload = {
      label,
      adventureId: hostAdventureId,
      riddle,
      answer: hashedAnswer,
    };

    try {
      const { id: puzzleId } = await createPuzzleDb(puzzlePayload);

      await Promise.all(
        hints.map(async ({ hint, delay }) => {
          await createHintDb({ puzzleId, hint, delay });
        }),
      );

      revalidatePath(`/adventure/${hostAdventureId}`);

      return { puzzleId };
    } catch (error) {
      const userFacingErrorMessage = "Failed to add puzzle";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }
  });
