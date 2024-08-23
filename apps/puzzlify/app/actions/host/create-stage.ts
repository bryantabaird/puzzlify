"use server";

import { stageSchema } from "@/app/schemas/stage";
import { hostActionClient } from "@/lib/nextSafeAction";
import prisma from "@/lib/prisma";
import hashInput from "@/server/helpers/hashInput";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createStage = hostActionClient
  .schema(stageSchema)
  .metadata({ actionName: "create-stage" })
  .action(async ({ parsedInput, bindArgsParsedInputs }) => {
    const { riddle, answer } = parsedInput;
    const { adventureId } = bindArgsParsedInputs[0];

    const hashedAnswer = await hashInput(answer);

    if (!adventureId) {
      throw new Error("Adventure ID is required");
    }

    const stage = { adventureId, riddle, answer: hashedAnswer };

    try {
      await prisma.stage.create({
        data: stage,
      });

      revalidatePath(`/adventure/${adventureId}`);
    } catch (error) {
      const userFacingErrorMessage = "Failed to add stage";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    redirect(`/adventure/${adventureId}`);
  });
