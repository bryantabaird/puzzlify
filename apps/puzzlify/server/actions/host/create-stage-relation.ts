"use server";

import { stageRelationSchema } from "@/schemas/stage-relation";
import { hostAdventureActionClient } from "@/lib/next-safe-action";
import { createStageRelationDb } from "@/server/db/stage-relation";

export const createStageRelation = hostAdventureActionClient
  .schema(stageRelationSchema)
  .metadata({ roleName: "host", actionName: "create-stage" })
  .action(async ({ parsedInput, ctx: { adventureId } }) => {
    const { fromStageId, toStageId } = parsedInput;

    try {
      const stageRelation = await createStageRelationDb(
        adventureId,
        fromStageId,
        toStageId,
      );

      return { stageRelationId: stageRelation.id };
    } catch (error) {
      const userFacingErrorMessage = "Failed to add stage";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }
  });
