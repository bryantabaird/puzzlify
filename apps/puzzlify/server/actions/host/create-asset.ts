"use server";

import { assetSchema } from "@/schemas/asset";
import { hostPuzzleActionClient } from "@/lib/next-safe-action";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAssetDb } from "@/server/db/asset";

export const createAsset = hostPuzzleActionClient
  .schema(assetSchema)
  .metadata({ roleName: "host", actionName: "create-asset" })
  .action(async ({ parsedInput, ctx: { hostAdventureId, hostPuzzleId } }) => {
    const { url, id } = parsedInput;

    try {
      await createAssetDb({ puzzleId: hostPuzzleId, url, id });

      revalidatePath(`/adventure/${hostAdventureId}/puzzle`);
    } catch (error) {
      const userFacingErrorMessage = "Failed to edit puzzle";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    redirect(`/adventure/${hostAdventureId}/puzzle`);
  });
