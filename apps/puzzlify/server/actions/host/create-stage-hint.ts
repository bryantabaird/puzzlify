"use server";

import { hintSchema } from "@/schemas/stage";
import { hostStageActionClient } from "@/lib/next-safe-action";
import { createHintDb } from "@/server/db/hint";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const addHint = hostStageActionClient
  .schema(hintSchema)
  .metadata({ roleName: "host", actionName: "add-hint" })
  .action(async ({ parsedInput, ctx }) => {
    const { hint, delay } = parsedInput;
    const { adventureId, stageId } = ctx;

    try {
      await createHintDb({ stageId, hint, delay });
    } catch (error) {
      const userFacingErrorMessage = "Failed to add hint";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    revalidatePath(`/adventure/${adventureId}/edit/stage/${stageId}`);
    redirect(`/adventure/${adventureId}/edit/stage/${stageId}`);
  });
