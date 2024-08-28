import prisma from "@/lib/prisma";
import { Stage, StageRelation } from "@prisma/client";
import { deleteStageRelationsDb } from "./stage-relation";
import { deleteStagesDb } from "./stage";

type DeleteStageRelationsAndStagesParams = {
  stageRelationIds: Array<StageRelation["id"]>;
  stageIds: Array<Stage["id"]>;
};
export const deleteStageRelationsAndStagesDb = async ({
  stageRelationIds,
  stageIds,
}: DeleteStageRelationsAndStagesParams) => {
  return await prisma.$transaction(async (prismaStageClient) => {
    console.log("deleting stage relations", stageRelationIds);
    await deleteStageRelationsDb({
      stageRelationIds,
      prismaClient: prismaStageClient,
    });
    console.log("deleting stages", stageIds);
    await deleteStagesDb({ stageIds, prismaClient: prismaStageClient });
  });
};
