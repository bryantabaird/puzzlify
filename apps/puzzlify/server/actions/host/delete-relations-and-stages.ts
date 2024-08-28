"use server";

import { hostActionClient } from "@/lib/nextSafeAction";
import { deleteStageRelationsSchema } from "@/schemas/stage-relation";
import { deleteStageRelationsAndStagesDb } from "@/server/db/transactions";
import { revalidatePath } from "next/cache";

export const deleteStagesAndRelations = hostActionClient
  .schema(deleteStageRelationsSchema)
  .metadata({ roleName: "host", actionName: "delete-stage-relation" })
  .action(async ({ parsedInput, bindArgsParsedInputs }) => {
    const [{ adventureId, stageId }] = bindArgsParsedInputs;

    const { stageRelationIds, stageIds } = parsedInput;

    if (!adventureId) {
      throw new Error("Adventure ID is required");
    }

    try {
      await deleteStageRelationsAndStagesDb({
        stageRelationIds,
        stageIds,
      });
    } catch (error) {
      const userFacingErrorMessage = "Failed to delete stage relations";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    revalidatePath(`/adventure/${adventureId}`);
  });
