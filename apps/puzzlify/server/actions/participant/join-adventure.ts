"use server";

import { participantActionClient } from "@/lib/nextSafeAction";
import { joinAdventureSchema } from "@/schemas/adventure";
import { addParticipantToAdventure } from "@/server/db/adventure";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const joinAdventure = participantActionClient
  .schema(joinAdventureSchema)
  .metadata({ roleName: "participant", actionName: "join-adventure" })
  .action(async ({ bindArgsParsedInputs, ctx }) => {
    const { userId } = ctx;
    const { adventureId } = bindArgsParsedInputs[0];

    if (!adventureId) {
      throw new Error("Adventure ID is required");
    }

    await addParticipantToAdventure(userId, adventureId);

    revalidatePath(`/adventure/${adventureId}`);
  });
