"use server";

import prisma from "@/lib/prisma";
import { Adventure, Stage, User, UserProgress } from "@prisma/client";

export const getParticipantStagesInProgress = async (
  userId: User["id"],
  adventureId: Adventure["id"],
) => {
  return await prisma.userProgress.findMany({
    where: {
      userId: userId,
      adventureId: adventureId,
      completionTime: null,
    },
    include: {
      stage: true,
    },
  });
};

type GetParticipantStageInProgressPayload = {
  userId: User["id"];
  adventureId: Adventure["id"];
  stageId: Stage["id"];
};

export const getParticipantStageInProgress = async ({
  userId,
  adventureId,
  stageId,
}: GetParticipantStageInProgressPayload) => {
  return await prisma.userProgress.findFirst({
    where: {
      userId: userId,
      adventureId: adventureId,
      stageId: stageId,
      completionTime: null,
    },
  });
};

export const getCountOfIncompletePreviousStages = async (
  adventureId: Adventure["id"],
  userId: User["id"],
  previousStageIds: Array<Stage["id"]>,
) => {
  return await prisma.userProgress.count({
    where: {
      userId,
      adventureId,
      stageId: { in: previousStageIds },
      completionTime: null,
    },
  });
};

export const createUserProgress = async (
  userId: User["id"],
  adventureId: Adventure["id"],
  stageId: Stage["id"],
  startTime: Date,
) => {
  return await prisma.userProgress.create({
    data: {
      userId,
      adventureId,
      stageId,
      startTime,
    },
  });
};

export const updateUserProgress = async (
  userId: User["id"],
  adventureId: Adventure["id"],
  stageId: Stage["id"],
  completionTime: Date,
) => {
  return prisma.userProgress.update({
    where: {
      userProgressId: {
        userId,
        adventureId,
        stageId,
      },
    },
    data: { completionTime },
  });
};

type CreateUserProgressesPayload = Array<
  Pick<UserProgress, "userId" | "adventureId" | "stageId">
>;
// TODO: For signup, the start time should be the adventure start time,
// but if we consider editing the start time on the adventure, ensure data integrity
// here such that a user progress start time becomes out of sync. Maybe the
// start time for starting stages could be a special ADVENTURE_START_TIME value
export const createUserProgresses = async (
  data: CreateUserProgressesPayload,
) => {
  return await prisma.userProgress.createMany({ data });
};

export const getUserStageStartTime = async (
  userId: User["id"],
  stageId: Stage["id"],
  adventureId: Adventure["id"],
) => {
  return await prisma.userProgress.findFirst({
    where: {
      userId,
      adventureId,
      stageId,
    },
    select: { startTime: true },
  });
};
