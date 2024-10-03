"use server";

import { hostPuzzleActionClient } from "@/lib/next-safe-action";
import { deletePuzzleDb } from "@/server/db/puzzle";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const deletePuzzle = hostPuzzleActionClient
  .metadata({ roleName: "host", actionName: "delete-puzzle" })
  .action(async ({ ctx: { hostPuzzleId, hostAdventureId } }) => {
    try {
      await deletePuzzleDb(hostPuzzleId);
    } catch (error) {
      const userFacingErrorMessage = "Failed to delete puzzle";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    revalidatePath(`/adventure/${hostAdventureId}`);
    redirect(`/adventure/${hostAdventureId}`);
  });
