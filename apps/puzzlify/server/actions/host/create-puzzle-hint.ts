"use server";

import { hintSchema } from "@/schemas/puzzle";
import { hostPuzzleActionClient } from "@/lib/next-safe-action";
import { createHintDb } from "@/server/db/hint";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const addHint = hostPuzzleActionClient
  .schema(hintSchema)
  .metadata({ roleName: "host", actionName: "add-hint" })
  .action(async ({ parsedInput, ctx: { hostAdventureId, hostPuzzleId } }) => {
    const { hint, delay } = parsedInput;

    try {
      await createHintDb({ puzzleId: hostPuzzleId, hint, delay });
    } catch (error) {
      const userFacingErrorMessage = "Failed to add hint";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    revalidatePath(`/adventure/${hostAdventureId}/edit/puzzle/${hostPuzzleId}`);
    redirect(`/adventure/${hostAdventureId}/edit/puzzle/${hostPuzzleId}`);
  });
