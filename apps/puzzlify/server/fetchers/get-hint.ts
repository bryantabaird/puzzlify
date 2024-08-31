"use server";

import { PrismaClient } from "@prisma/client";
import { getTeamStageStartTime } from "../db/team-progress";
import { getUserId } from "../helpers/getUserId";
import { getTeamId } from "../helpers/getTeamId";

const prisma = new PrismaClient();

export const getHintIfAvailable = async (
  hintId: string,
  stageId: string,
  adventureId: string,
) => {
  const userId = await getUserId();

  const hint = await prisma.hint.findUnique({
    where: { id: hintId },
    select: {
      delay: true,
      hint: true,
    },
  });

  if (!hint) {
    throw new Error("Hint not found");
  }

  const teamId = await getTeamId(userId, adventureId);

  const teamProgress = await getTeamStageStartTime({
    teamId,
    stageId,
    adventureId,
  });

  if (!teamProgress) {
    throw new Error("Team progress not found for this stage");
  }

  const hintAccessTime = new Date(
    new Date(teamProgress.startTime).getTime() + hint.delay * 1000,
  );

  const currentTime = new Date();

  if (currentTime >= hintAccessTime) {
    return hint.hint; // The hint is accessible
  } else {
    // TODO: 403 Forbidden
    throw new Error("Hint is not accessible yet");
  }
};
