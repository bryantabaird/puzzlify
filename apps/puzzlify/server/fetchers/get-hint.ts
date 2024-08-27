"use server";

import { PrismaClient } from "@prisma/client";
import { getUserStageStartTime } from "../db/user-progress";
import { getUserId } from "../helpers/getUserId";

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

  console.log("ids", userId, stageId, adventureId);

  const userProgress = await getUserStageStartTime(
    userId,
    stageId,
    adventureId,
  );

  if (!userProgress) {
    throw new Error("User progress not found for this stage");
  }

  const hintAccessTime = new Date(
    new Date(userProgress.startTime).getTime() + hint.delay * 1000,
  );

  const currentTime = new Date();

  if (currentTime >= hintAccessTime) {
    return hint.hint; // The hint is accessible
  } else {
    // TODO: 403 Forbidden
    throw new Error("Hint is not accessible yet");
  }
};
