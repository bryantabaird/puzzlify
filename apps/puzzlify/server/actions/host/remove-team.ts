"use server";

import { hostAdventureActionClient } from "@/lib/next-safe-action";
import { removeTeamFromAdventureSchema } from "@/schemas/adventure";
import { deleteTeamAdventure } from "@/server/db/team-adventure";
import { revalidatePath } from "next/cache";

export const removeTeam = hostAdventureActionClient
  .schema(removeTeamFromAdventureSchema)
  .metadata({ roleName: "host", actionName: "remove-team" })
  .action(async ({ parsedInput, ctx: { hostAdventureId } }) => {
    const { teamId } = parsedInput;

    try {
      await deleteTeamAdventure({ adventureId: hostAdventureId, teamId });
    } catch (error) {
      const userFacingErrorMessage = "Failed to remove team from adventure";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    revalidatePath(`/adventure/${hostAdventureId}`);
  });
