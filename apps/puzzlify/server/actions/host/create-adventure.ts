"use server";

import { adventureSchema } from "@/schemas/adventure";
import { hostActionClient } from "@/lib/nextSafeAction";
import { revalidatePath } from "next/cache";
import { createAdventureDb } from "@/server/db/adventure";

export const createAdventure = hostActionClient
  .schema(adventureSchema)
  .metadata({ roleName: "host", actionName: "create-adventure" })
  .action(async ({ parsedInput, ctx }) => {
    const { name, startDate } = parsedInput;

    const { userId } = ctx;

    const data = { name, hostId: userId, startDate: new Date(startDate) };

    try {
      const adventure = await createAdventureDb(data);
      const adventureId = adventure.id;

      revalidatePath(`/adventure/${adventureId}`);
      return { adventureId };
    } catch (error) {
      const userFacingErrorMessage = "Failed to add adventure";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }
  });
