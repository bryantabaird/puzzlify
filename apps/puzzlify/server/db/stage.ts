import prisma from "@/lib/prisma";
import { Stage } from "@prisma/client";

export const getStageWithPreviousAndNextStages = async (
  stageId: Stage["id"],
) => {
  return await prisma.stage.findUnique({
    where: { id: stageId },
    include: {
      hints: true,
      previousStages: {
        include: {
          fromStage: true,
        },
      },
      nextStages: {
        include: {
          toStage: true,
        },
      },
    },
  });
};

export const getStageValidationData = async (stageId: Stage["id"]) => {
  return await prisma.stage.findUnique({
    where: { id: stageId },
    select: { answer: true, id: true, nextStages: true },
  });
};

export const getStageWithHints = async (stageId: Stage["id"]) => {
  return await prisma.stage.findUnique({
    where: { id: stageId },
    include: {
      hints: true,
    },
  });
};

type CreateStagePayload = Pick<Stage, "riddle" | "answer" | "adventureId">;
export const createStageDb = async (data: CreateStagePayload) => {
  return await prisma.stage.create({ data });
};

export const deleteStageDb = async (stageId: string) => {
  return await prisma.$transaction([
    prisma.hint.deleteMany({
      where: {
        stageId: stageId,
      },
    }),
    prisma.stage.delete({
      where: {
        id: stageId,
      },
    }),
  ]);
};

type UpdateStagePayload = Pick<Stage, "riddle" | "answer">;
export const updateStageDb = async (
  stageId: string,
  data: UpdateStagePayload,
) => {
  return await prisma.stage.update({
    where: { id: stageId },
    data,
  });
};

export const getHostStageId = async (stageId: string, userId: string) => {
  return await prisma.stage.findFirst({
    where: {
      id: stageId,
      adventure: {
        hostId: userId,
      },
    },
    select: { id: true },
  });
};

export const getStartStages = async (adventureId: string) => {
  return await prisma.stage.findMany({
    where: {
      adventureId,
      previousStages: {
        none: {},
      },
    },
  });
};
