"use server";

import { hostHintActionClient } from "@/lib/next-safe-action";
import { deleteHintDb } from "@/server/db/hint";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const deleteHint = hostHintActionClient
  .schema(z.object({}))
  .metadata({ roleName: "host", actionName: "delete-hint" })
  .action(async ({ ctx: { hostAdventureId, hostPuzzleId, hintId } }) => {
    try {
      await deleteHintDb(hintId);
    } catch (error) {
      const userFacingErrorMessage = "Failed to delete hint";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    revalidatePath(`/adventure/${hostAdventureId}/edit/puzzle/${hostPuzzleId}`);
    redirect(`/adventure/${hostAdventureId}/edit/puzzle/${hostPuzzleId}`);
  });
