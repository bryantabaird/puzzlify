"use server";

import prisma from "@/lib/prisma";
import { Stage } from "@prisma/client";

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
