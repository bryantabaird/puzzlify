"use server";

import { hostStageActionClient } from "@/lib/next-safe-action";
import { deleteStageDb } from "@/server/db/stage";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const deleteStage = hostStageActionClient
  .schema(z.object({}))
  .metadata({ roleName: "host", actionName: "delete-stage" })
  .action(async ({ ctx: { adventureId, stageId } }) => {
    try {
      await deleteStageDb(stageId);
    } catch (error) {
      const userFacingErrorMessage = "Failed to delete stage";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    revalidatePath(`/adventure/${adventureId}`);
    redirect(`/adventure/${adventureId}`);
  });
