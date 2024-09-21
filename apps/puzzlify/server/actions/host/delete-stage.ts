"use server";

import { hostAdventureActionClient } from "@/lib/next-safe-action";
import { deleteStageDb } from "@/server/db/stage";
import { isStageHost } from "@/server/helpers/isStageHost";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const deleteStageSchema = z.object({
  stageId: z.string(),
});

export const deleteStage = hostAdventureActionClient
  .schema(deleteStageSchema)
  .metadata({ roleName: "host", actionName: "delete-stage" })
  .action(
    async ({ parsedInput: { stageId }, ctx: { userId, adventureId } }) => {
      // TODO: Need to validate that the user is the host of the adventure
      // of the stage being deleted. Maybe there is a better way to do this.
      // For example, checking that the adventureId on the stage matches the
      // adventureId provided in the ctx, which is already validated. Optional.
      const isHost = await isStageHost({ stageId, userId });

      if (!isHost) {
        throw new Error("User is not the host of this stage");
      }

      try {
        await deleteStageDb(stageId);
      } catch (error) {
        const userFacingErrorMessage = "Failed to delete stage";
        console.error(userFacingErrorMessage, error);
        return { error: userFacingErrorMessage };
      }

      revalidatePath(`/adventure/${adventureId}`);
      redirect(`/adventure/${adventureId}`);
    },
  );
