"use server";

import { userActionClient } from "@/lib/next-safe-action";
import { createTeamSchema } from "@/schemas/adventure";
import { getAdventureTeamData } from "@/server/db/adventure";
import { createTeam } from "@/server/db/team";
import {
  createTeamAdventure,
  getTeamAdventure,
} from "@/server/db/team-adventure";
import { revalidatePath } from "next/cache";

export const createTeamAndJoinAdventure = userActionClient
  .schema(createTeamSchema)
  .metadata({ roleName: "team", actionName: "join-adventure" })
  .action(async ({ parsedInput, bindArgsParsedInputs, ctx }) => {
    const { userId } = ctx;
    const { adventureId } = bindArgsParsedInputs[0];

    const { teamName } = parsedInput;

    const team = await createTeam({ name: teamName, userId });

    // TODO: This action should know if the adventure id is valid. Need
    // to think through more the userActionClient vs teamActionClient here
    if (!adventureId) {
      throw new Error("Adventure ID is required");
    }

    const teamAdventure = await getTeamAdventure({
      teamId: team.id,
      adventureId,
    });

    if (teamAdventure) {
      throw new Error("Team is already part of the adventure");
    }

    const adventureData = await getAdventureTeamData(adventureId);

    if (!adventureData) {
      throw new Error("Adventure not found");
    }

    const numberOfTeams = adventureData._count.teams;
    const maxTeamsSupported = adventureData.tier.maxTeamCount;
    const isWaitlisted = numberOfTeams >= maxTeamsSupported;

    await createTeamAdventure({
      teamId: team.id,
      adventureId,
      waitlisted: isWaitlisted,
    });

    revalidatePath(`/adventure/${adventureId}`);
  });
