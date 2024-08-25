"use server";

import { adventureSchema } from "@/app/schemas/adventure";
import { hostActionClient } from "@/lib/nextSafeAction";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdventureDb } from "@/server/db/adventure";

export const createAdventure = hostActionClient
  .schema(adventureSchema)
  .metadata({ roleName: "host", actionName: "create-adventure" })
  .action(async ({ parsedInput, ctx }) => {
    const { name, startDate } = parsedInput;

    const { userId } = ctx;

    const data = { name, hostId: userId, startDate: new Date(startDate) };

    let adventureId;
    try {
      const adventure = await createAdventureDb(data);
      adventureId = adventure.id;

      revalidatePath(`/adventure/${adventureId}`);
    } catch (error) {
      const userFacingErrorMessage = "Failed to add adventure";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    redirect(`/adventure/${adventureId}`);
  });
