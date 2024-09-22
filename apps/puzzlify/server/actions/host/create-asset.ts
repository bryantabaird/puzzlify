"use server";

import { assetSchema } from "@/schemas/asset";
import { hostPuzzleActionClient } from "@/lib/next-safe-action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAssetDb } from "@/server/db/asset";

export const createAsset = hostPuzzleActionClient
  .schema(assetSchema)
  .metadata({ roleName: "host", actionName: "create-asset" })
  .action(async ({ parsedInput, ctx: { adventureId, puzzleId } }) => {
    const { url, id } = parsedInput;

    try {
      await createAssetDb({ puzzleId, url, id });

      revalidatePath(`/adventure/${adventureId}/puzzle`);
    } catch (error) {
      const userFacingErrorMessage = "Failed to edit puzzle";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    redirect(`/adventure/${adventureId}/puzzle`);
  });
