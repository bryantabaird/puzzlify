"use server";

import { assetIdSchema } from "@/schemas/stage";
import { hostStageActionClient } from "@/lib/next-safe-action";
import { addAssetToStageDb } from "@/server/db/stage";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const addAssetToStage = hostStageActionClient
  .schema(assetIdSchema)
  .metadata({ roleName: "host", actionName: "add-action-to-stage" })
  .action(async ({ parsedInput, ctx: { adventureId, stageId } }) => {
    const { assetId } = parsedInput;

    try {
      await addAssetToStageDb({ stageId, assetId });

      revalidatePath(`/adventure/${adventureId}/stage`);
    } catch (error) {
      const userFacingErrorMessage = "Failed to edit stage";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    redirect(`/adventure/${adventureId}/stage`);
  });
