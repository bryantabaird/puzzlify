"use server";

import { hostActionClient } from "@/lib/nextSafeAction";
import { deleteHintDb } from "@/server/db/hint";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const deleteHint = hostActionClient
  .schema(z.object({}))
  .metadata({ roleName: "host", actionName: "delete-hint" })
  .action(async ({ bindArgsParsedInputs }) => {
    const [{ adventureId, stageId, hintId }] = bindArgsParsedInputs;

    console.log("deleting");

    if (!stageId) {
      throw new Error("Stage ID is required");
    }

    if (!adventureId) {
      throw new Error("Adventure ID is required");
    }

    if (!hintId) {
      throw new Error("Hint ID is required");
    }

    try {
      await deleteHintDb(hintId);
    } catch (error) {
      const userFacingErrorMessage = "Failed to delete hint";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    revalidatePath(`/adventure/${adventureId}/stage/${stageId}`);
    redirect(`/adventure/${adventureId}/stage/${stageId}`);
  });
