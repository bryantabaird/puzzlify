"use server";

import { hostActionClient } from "@/lib/nextSafeAction";
import { deleteAdventureDb } from "@/server/db/adventure";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const deleteAdventure = hostActionClient
  .schema(z.object({}))
  .metadata({ roleName: "host", actionName: "delete-adventure" })
  .action(async ({ bindArgsParsedInputs }) => {
    const [{ adventureId }] = bindArgsParsedInputs;

    if (!adventureId) {
      throw new Error("Adventure ID is required");
    }

    try {
      await deleteAdventureDb(adventureId);
    } catch (error) {
      const userFacingErrorMessage = "Failed to delete hint";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    revalidatePath(`/dashboard`);
  });
