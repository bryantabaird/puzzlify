"use server";

import { puzzleRelationSchema } from "@/schemas/puzzle-relation";
import { hostAdventureActionClient } from "@/lib/next-safe-action";
import { createPuzzleRelationDb } from "@/server/db/puzzle-relation";

export const createPuzzleRelation = hostAdventureActionClient
  .schema(puzzleRelationSchema)
  .metadata({ roleName: "host", actionName: "create-puzzle" })
  .action(async ({ parsedInput, ctx: { adventureId } }) => {
    const { fromPuzzleId, toPuzzleId } = parsedInput;

    try {
      const puzzleRelation = await createPuzzleRelationDb(
        adventureId,
        fromPuzzleId,
        toPuzzleId,
      );

      return { puzzleRelationId: puzzleRelation.id };
    } catch (error) {
      const userFacingErrorMessage = "Failed to add puzzle";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }
  });
