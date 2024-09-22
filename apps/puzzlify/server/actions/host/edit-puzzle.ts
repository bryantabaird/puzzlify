"use server";

import { puzzleSchema } from "@/schemas/puzzle";
import { hostPuzzleActionClient } from "@/lib/next-safe-action";
import { updatePuzzleDb } from "@/server/db/puzzle";
import hashInput from "@/server/helpers/hashInput";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const editPuzzle = hostPuzzleActionClient
  .schema(puzzleSchema)
  .metadata({ roleName: "host", actionName: "edit-puzzle" })
  .action(async ({ parsedInput, ctx: { adventureId, puzzleId } }) => {
    const { riddle, answer, label } = parsedInput;

    const hashedAnswer = answer ? await hashInput(answer) : null;

    try {
      await updatePuzzleDb(puzzleId, { label, riddle, answer: hashedAnswer });

      revalidatePath(`/adventure/${adventureId}`);
    } catch (error) {
      const userFacingErrorMessage = "Failed to edit puzzle";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    redirect(`/adventure/${adventureId}/puzzle`);
  });
