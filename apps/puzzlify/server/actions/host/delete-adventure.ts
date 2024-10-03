"use server";

import { hostAdventureActionClient } from "@/lib/next-safe-action";
import { deleteAdventureDb } from "@/server/db/adventure";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const deleteAdventure = hostAdventureActionClient
  .schema(z.object({}))
  .metadata({ roleName: "host", actionName: "delete-adventure" })
  .action(async ({ ctx: { hostAdventureId } }) => {
    try {
      await deleteAdventureDb(hostAdventureId);
    } catch (error) {
      const userFacingErrorMessage = "Failed to delete adventures";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    revalidatePath(`/dashboard`);
  });
