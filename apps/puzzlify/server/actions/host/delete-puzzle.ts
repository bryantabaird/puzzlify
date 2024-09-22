"use server";

import { hostAdventureActionClient } from "@/lib/next-safe-action";
import { deletePuzzleDb } from "@/server/db/puzzle";
import { isPuzzleHost } from "@/server/helpers/isPuzzleHost";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const deletePuzzleSchema = z.object({
  puzzleId: z.string(),
});

export const deletePuzzle = hostAdventureActionClient
  .schema(deletePuzzleSchema)
  .metadata({ roleName: "host", actionName: "delete-puzzle" })
  .action(
    async ({ parsedInput: { puzzleId }, ctx: { userId, adventureId } }) => {
      // TODO: Need to validate that the user is the host of the adventure
      // of the puzzle being deleted. Maybe there is a better way to do this.
      // For example, checking that the adventureId on the puzzle matches the
      // adventureId provided in the ctx, which is already validated. Optional.
      const isHost = await isPuzzleHost({ puzzleId, userId });

      if (!isHost) {
        throw new Error("User is not the host of this puzzle");
      }

      try {
        await deletePuzzleDb(puzzleId);
      } catch (error) {
        const userFacingErrorMessage = "Failed to delete puzzle";
        console.error(userFacingErrorMessage, error);
        return { error: userFacingErrorMessage };
      }

      revalidatePath(`/adventure/${adventureId}`);
      redirect(`/adventure/${adventureId}`);
    },
  );
