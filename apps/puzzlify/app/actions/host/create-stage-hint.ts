"use server";

import { hintSchema } from "@/app/schemas/stage";
import { hostActionClient } from "@/lib/nextSafeAction";
import { createHintDb } from "@/server/db/hint";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const addHint = hostActionClient
  .schema(hintSchema)
  .metadata({ roleName: "host", actionName: "add-hint" })
  .action(async ({ parsedInput, bindArgsParsedInputs }) => {
    console.log("addHint action");
    const { hint, delay } = parsedInput;
    const [{ adventureId, stageId }] = bindArgsParsedInputs;

    if (!stageId) {
      throw new Error("Stage ID is required");
    }

    if (!adventureId) {
      throw new Error("Adventure ID is required");
    }

    try {
      await createHintDb({ stageId, hint, delay });
    } catch (error) {
      const userFacingErrorMessage = "Failed to add hint";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    revalidatePath(`/adventure/${adventureId}/stage/${stageId}`);
    redirect(`/adventure/${adventureId}/stage/${stageId}`);
  });
