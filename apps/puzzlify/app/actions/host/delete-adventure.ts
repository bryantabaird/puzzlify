"use server";

import { hostActionClient } from "@/lib/nextSafeAction";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const deleteAdventure = hostActionClient
  .schema(z.object({}))
  .metadata({ actionName: "delete-adventure" })
  .action(async ({ bindArgsParsedInputs }) => {
    const [{ adventureId }] = bindArgsParsedInputs;

    if (!adventureId) {
      throw new Error("Adventure ID is required");
    }

    try {
      await prisma.adventure.delete({
        where: { id: adventureId },
      });
    } catch (error) {
      const userFacingErrorMessage = "Failed to delete hint";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    revalidatePath(`/dashboard`);
  });
