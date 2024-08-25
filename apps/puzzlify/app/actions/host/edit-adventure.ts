"use server";

import { adventureSchema } from "@/app/schemas/adventure";
import { hostActionClient } from "@/lib/nextSafeAction";
import { updateAdventureDb } from "@/server/db/adventure";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// TODO: /adventure/undefined/stage/28f09d72-a727-45ba-a8ad-7bb2761cce66
// Make sure this link doesn't work

export const editAdventure = hostActionClient
  .schema(adventureSchema)
  .metadata({ roleName: "host", actionName: "edit-adventure" })
  .action(async ({ parsedInput, bindArgsParsedInputs }) => {
    const { name, startDate } = parsedInput;
    const [{ adventureId }] = bindArgsParsedInputs;

    if (!adventureId) {
      throw new Error("Adventure ID is required");
    }

    const parsedStartDate = new Date(startDate);

    if (isNaN(parsedStartDate.getTime())) {
      throw new Error("Invalid start date");
    }

    // TODO: Consider when editing the start date after an adventure has started

    try {
      await updateAdventureDb(adventureId, {
        name,
        startDate: parsedStartDate,
      });
    } catch (error) {
      const userFacingErrorMessage = "Failed to edit adventure";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    revalidatePath(`/adventure/${adventureId}`);
    redirect(`/adventure/${adventureId}`);
  });
