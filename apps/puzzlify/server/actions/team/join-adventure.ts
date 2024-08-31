"use server";

import { userActionClient } from "@/lib/next-safe-action";
import { joinAdventureSchema } from "@/schemas/adventure";
import { addTeamToAdventure } from "@/server/db/adventure";
import { createTeam } from "@/server/db/team";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const joinAdventure = userActionClient
  .schema(joinAdventureSchema)
  .metadata({ roleName: "team", actionName: "join-adventure" })
  .action(async ({ parsedInput, bindArgsParsedInputs, ctx }) => {
    const { userId } = ctx;
    const { adventureId } = bindArgsParsedInputs[0];

    const { teamName } = parsedInput;

    if (!adventureId) {
      throw new Error("Adventure ID is required");
    }

    const team = await createTeam({ name: teamName, adventureId, userId });

    await addTeamToAdventure({ teamId: team.id, adventureId });

    revalidatePath(`/adventure/${adventureId}`);
  });
