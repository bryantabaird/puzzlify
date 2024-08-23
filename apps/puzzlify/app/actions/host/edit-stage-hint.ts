"use server";

import { hintSchema } from "@/app/schemas/stage";
import { hostActionClient } from "@/lib/nextSafeAction";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// TODO: /adventure/undefined/stage/28f09d72-a727-45ba-a8ad-7bb2761cce66
// Make sure this link doesn't work

export const editHint = hostActionClient
  .schema(hintSchema)
  .metadata({ actionName: "edit-hint" })
  .action(async ({ parsedInput, bindArgsParsedInputs }) => {
    const { hint, delay } = parsedInput;
    const [{ hintId, stageId, adventureId }] = bindArgsParsedInputs;

    if (!adventureId || !stageId || !hintId) {
      throw new Error("Adventure ID, Stage ID, and Hint ID are required");
    }

    try {
      await prisma.hint.update({
        where: { id: hintId },
        data: {
          hint,
          delay,
        },
      });
    } catch (error) {
      const userFacingErrorMessage = "Failed to add hint";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    revalidatePath(`/adventure/${adventureId}/stage/${stageId}`);
    redirect(`/adventure/${adventureId}/stage/${stageId}`);
  });
