import prisma from "@/lib/prisma";
import { Adventure, Prisma, Stage, StageRelation } from "@prisma/client";

export const getNextStagesWithNextedPreviousStages = async (
  stageId: Stage["id"],
) => {
  return await prisma.stageRelation.findMany({
    where: {
      fromStageId: stageId,
    },
    select: {
      toStageId: true,
      toStage: {
        select: {
          previousStages: {
            where: {
              fromStageId: { not: stageId },
            },
            select: {
              fromStageId: true,
            },
          },
        },
      },
    },
  });
};

export const createStageRelationDb = async (
  adventureId: Adventure["id"],
  fromStageId: Stage["id"],
  toStageId: Stage["id"],
) => {
  return await prisma.stageRelation.create({
    data: {
      adventureId,
      fromStageId,
      toStageId,
    },
  });
};

type DeleteStageRelationsFromStageDbParams = {
  stageId: Stage["id"];
  prismaClient?: Prisma.TransactionClient;
};
export const deleteStageRelationsFromStageDb = async ({
  stageId,
  prismaClient = prisma,
}: DeleteStageRelationsFromStageDbParams) => {
  return await prismaClient.stageRelation.deleteMany({
    where: {
      OR: [{ fromStageId: stageId }, { toStageId: stageId }],
    },
  });
};

type DeleteStageRelationsDbParams = {
  stageRelationIds: Array<StageRelation["id"]>;
  prismaClient?: Prisma.TransactionClient;
};
export const deleteStageRelationsDb = async ({
  stageRelationIds,
  prismaClient = prisma,
}: DeleteStageRelationsDbParams) => {
  return await prismaClient.stageRelation.deleteMany({
    where: {
      id: { in: stageRelationIds },
    },
  });
};
