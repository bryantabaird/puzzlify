"use server";

import prisma from "@/lib/prisma";
import { Prisma, Stage } from "@prisma/client";
import { deleteStageRelationsFromStageDb } from "./stage-relation";
import { deleteHintsFromStagesDb } from "./hint";

export type StageWithPreviousAndNextStages = Awaited<
  ReturnType<typeof getStageWithPreviousAndNextStages>
>;

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

type CreateStagePayload = Pick<
  Stage,
  "label" | "riddle" | "answer" | "adventureId"
>;
export const createStageDb = async (data: CreateStagePayload) => {
  return await prisma.stage.create({ data });
};

export const deleteStageDb = async (stageId: string) => {
  return await prisma.$transaction(async (prismaStageClient) => {
    await deleteStageRelationsFromStageDb({
      stageId,
      prismaClient: prismaStageClient,
    });
    return await prismaStageClient.stage.delete({
      where: {
        id: stageId,
      },
    });
  });
};

// TODO: Prevent delete either if adventure started
// or if a team has arrived at this stage after start
export const deleteStagesDb = async ({
  stageIds,
  prismaClient = prisma,
}: {
  stageIds: string[];
  prismaClient?: Prisma.TransactionClient;
}) => {
  // TODO: Make transactional
  await deleteHintsFromStagesDb(stageIds);
  return await prismaClient.stage.deleteMany({
    where: {
      id: { in: stageIds },
    },
  });
};

type UpdateStagePayload =
  | Pick<Stage, "label">
  | Pick<Stage, "label" | "riddle" | "answer">;
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

export const getAdventureStages = async (adventureId: string) => {
  return await prisma.stage.findMany({
    where: { adventureId },
    select: { id: true, label: true },
  });
};
