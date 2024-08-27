"use server";

import { participantActionClient } from "@/lib/nextSafeAction";
import { getAdventureStartDateTime } from "@/server/db/adventure";
import { getStartStages } from "@/server/db/stage";
import { createUserProgresses } from "@/server/db/user-progress";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export const beginAdventure = participantActionClient
  .schema(z.object({}))
  .metadata({ roleName: "participant", actionName: "begin-adventure" })
  .action(async ({ bindArgsParsedInputs, ctx }) => {
    const { userId } = ctx;
    const { adventureId } = bindArgsParsedInputs[0];

    if (!adventureId) {
      throw new Error("Adventure ID is required");
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

    const userProgressEntries = startStages.map((stage) => ({
      userId: userId,
      adventureId: adventureId,
      stageId: stage.id,
    }));

    await createUserProgresses(userProgressEntries);

    revalidatePath(`/adventure/${adventureId}`);
    redirect(`/adventure/${adventureId}/stage`);
  });
