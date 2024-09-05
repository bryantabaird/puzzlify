"use server";

import { assetSchema } from "@/schemas/asset";
import { hostStageActionClient } from "@/lib/next-safe-action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAssetDb } from "@/server/db/asset";

export const createAsset = hostStageActionClient
  .schema(assetSchema)
  .metadata({ roleName: "host", actionName: "create-asset" })
  .action(async ({ parsedInput, ctx: { adventureId, stageId } }) => {
    const { url, id } = parsedInput;

    try {
      await createAssetDb({ stageId, url, id });

      revalidatePath(`/adventure/${adventureId}/stage`);
    } catch (error) {
      const userFacingErrorMessage = "Failed to edit stage";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    redirect(`/adventure/${adventureId}/stage`);
  });
