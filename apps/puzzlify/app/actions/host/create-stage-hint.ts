"use server";

import { hintSchema } from "@/app/schemas/stage";
import { hostActionClient } from "@/lib/nextSafeAction";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const addHint = hostActionClient
  .schema(hintSchema)
  .metadata({ actionName: "add-hint" })
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
      await prisma.hint.create({
        data: { hint, stageId, delay },
      });
    } catch (error) {
      const userFacingErrorMessage = "Failed to add hint";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    revalidatePath(`/adventure/${adventureId}/stage/${stageId}`);
    redirect(`/adventure/${adventureId}/stage/${stageId}`);
  });
