"use server";

import { PrismaClient } from "@prisma/client";
import { getTeamPuzzleStartTime } from "../db/team-progress";
import { getUserId } from "../helpers/getUserId";
import { get } from "http";
import { getTeamUserFromAdventureUser } from "../db/team-user";

const prisma = new PrismaClient();

export const getHintIfAvailable = async (
  hintId: string,
  puzzleId: string,
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

  // TODO: Consolidate to a getTeamId helper
  const teamUser = await getTeamUserFromAdventureUser({ userId, adventureId });

  if (!teamUser) {
    throw new Error("User is not on a team that is part of this adventure");
  }

  const teamProgress = await getTeamPuzzleStartTime({
    teamId: teamUser.teamId,
    puzzleId,
    adventureId,
  });

  if (!teamProgress) {
    throw new Error("Team progress not found for this puzzle");
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
