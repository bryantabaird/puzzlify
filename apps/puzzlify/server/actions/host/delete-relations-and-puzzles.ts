"use server";

import { hostAdventureActionClient } from "@/lib/next-safe-action";
import { deletePuzzleRelationsSchema } from "@/schemas/puzzle-relation";
import { deletePuzzleRelationsAndPuzzlesDb } from "@/server/db/transactions";
import { revalidatePath } from "next/cache";

export const deletePuzzlesAndRelations = hostAdventureActionClient
  .schema(deletePuzzleRelationsSchema)
  .metadata({ roleName: "host", actionName: "delete-puzzle-relation" })
  .action(async ({ parsedInput, ctx: { adventureId } }) => {
    const { puzzleRelationIds, puzzleIds } = parsedInput;

    if (!adventureId) {
      throw new Error("Adventure ID is required");
    }

    try {
      await deletePuzzleRelationsAndPuzzlesDb({
        puzzleRelationIds,
        puzzleIds,
      });
    } catch (error) {
      const userFacingErrorMessage = "Failed to delete puzzle relations";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    revalidatePath(`/adventure/${adventureId}`);
  });
