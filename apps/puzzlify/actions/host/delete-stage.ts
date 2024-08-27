"use server";

import { hostActionClient } from "@/lib/nextSafeAction";
import { deleteStageDb } from "@/server/db/stage";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const deleteStage = hostActionClient
  .schema(z.object({}))
  .metadata({ roleName: "host", actionName: "delete-stage" })
  .action(async ({ bindArgsParsedInputs }) => {
    const [{ adventureId, stageId }] = bindArgsParsedInputs;

    console.log("deleting");

    if (!stageId) {
      throw new Error("Stage ID is required");
    }

    if (!adventureId) {
      throw new Error("Adventure ID is required");
    }

    try {
      await deleteStageDb(stageId);
    } catch (error) {
      const userFacingErrorMessage = "Failed to delete hint";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    revalidatePath(`/adventure/${adventureId}`);
    redirect(`/adventure/${adventureId}`);
  });
