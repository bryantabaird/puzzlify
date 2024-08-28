"use server";

import { stageRelationSchema } from "@/schemas/stage-relation";
import { hostActionClient } from "@/lib/nextSafeAction";
import { createStageRelationDb } from "@/server/db/stage-relation";

export const createStageRelation = hostActionClient
  .schema(stageRelationSchema)
  .metadata({ roleName: "host", actionName: "create-stage" })
  .action(async ({ parsedInput, bindArgsParsedInputs }) => {
    const { fromStageId, toStageId } = parsedInput;
    const { adventureId } = bindArgsParsedInputs[0];

    if (!adventureId) {
      throw new Error("Adventure ID is required");
    }

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
