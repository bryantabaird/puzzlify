"use server";

import { hintSchema } from "@/schemas/puzzle";
import { hostHintActionClient } from "@/lib/next-safe-action";
import { updateHintDb } from "@/server/db/hint";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// TODO: /adventure/undefined/puzzle/28f09d72-a727-45ba-a8ad-7bb2761cce66
// Make sure this link doesn't work

export const editHint = hostHintActionClient
  .schema(hintSchema)
  .metadata({ roleName: "host", actionName: "edit-hint" })
  .action(
    async ({ parsedInput, ctx: { hostAdventureId, hostPuzzleId, hintId } }) => {
      const { hint, delay } = parsedInput;

      try {
        await updateHintDb(hintId, { hint, delay });
      } catch (error) {
        const userFacingErrorMessage = "Failed to edit hint";
        console.error(userFacingErrorMessage, error);
        return { error: userFacingErrorMessage };
      }

      revalidatePath(
        `/adventure/${hostAdventureId}/edit/puzzle/${hostPuzzleId}`,
      );
      redirect(`/adventure/${hostAdventureId}/edit/puzzle/${hostPuzzleId}`);
    },
  );
