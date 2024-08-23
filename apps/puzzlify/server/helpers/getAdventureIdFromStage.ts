import prisma from "@/lib/prisma";
import { Adventure } from "@prisma/client";

export const getAdventureIdFromStage = async (
  stageId: string,
): Promise<Adventure["id"]> => {
  console.log("adventureIdFromStage", stageId);
  const stage = await prisma.stage.findUnique({
    where: { id: stageId },
    select: { adventureId: true },
  });

  console.log("stage", stage);

  if (!stage) {
    throw new Error("Stage not found");
  }

  return stage.adventureId;
};
