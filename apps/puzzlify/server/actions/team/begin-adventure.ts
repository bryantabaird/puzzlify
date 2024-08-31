"use server";

import { teamAdventureActionClient } from "@/lib/next-safe-action";
import { getAdventureStartDateTime } from "@/server/db/adventure";
import { getStartStages } from "@/server/db/stage";
import { createTeamProgresses } from "@/server/db/team-progress";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const beginAdventure = teamAdventureActionClient
  .schema(z.object({}))
  .metadata({ roleName: "team", actionName: "begin-adventure" })
  .action(async ({ bindArgsParsedInputs, ctx }) => {
    const { teamId } = ctx;
    const { adventureId } = bindArgsParsedInputs[0];

    if (!adventureId) {
      throw new Error("Adventure ID is required");
    }

    if (!teamId) {
      throw new Error("Team ID is required");
    }

    // TODO: Ensure that all adventures have at least one stage before starting
    const adventure = await getAdventureStartDateTime(adventureId);

    if (!adventure) {
      throw new Error("Adventure not found");
    }

    const { startDate } = adventure;
    const now = new Date();

    if (startDate > now) {
      throw new Error("Adventure has not started yet");
    }

    const startStages = await getStartStages(adventureId);

    const teamProgressEntries = startStages.map((stage) => ({
      teamId: teamId,
      adventureId: adventureId,
      stageId: stage.id,
    }));

    await createTeamProgresses(teamProgressEntries);

    revalidatePath(`/adventure/${adventureId}`);
    redirect(`/adventure/${adventureId}/stage`);
  });
