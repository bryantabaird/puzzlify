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
export const createUserProgresses = async (
  data: CreateUserProgressesPayload,
) => {
  return await prisma.userProgress.createMany({ data });
};
