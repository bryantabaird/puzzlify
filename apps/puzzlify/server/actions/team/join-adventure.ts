"use server";

import { teamActionClient } from "@/lib/nextSafeAction";
import { joinAdventureSchema } from "@/schemas/adventure";
import { addTeamToAdventure } from "@/server/db/adventure";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const joinAdventure = teamActionClient
  .schema(joinAdventureSchema)
  .metadata({ roleName: "team", actionName: "join-adventure" })
  .action(async ({ bindArgsParsedInputs, ctx }) => {
    const { userId } = ctx;
    const { adventureId } = bindArgsParsedInputs[0];

    if (!adventureId) {
      throw new Error("Adventure ID is required");
    }

    await addTeamToAdventure(userId, adventureId);

    revalidatePath(`/adventure/${adventureId}`);
  });
