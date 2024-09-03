import prisma from "@/lib/prisma";
import { Asset, Stage } from "@prisma/client";

export const createAssetDb = async ({
  id,
  stageId,
  url,
}: {
  id: Asset["id"];
  stageId: Stage["id"];
  url: string;
}) => {
  await prisma.asset.create({
    data: {
      id,
      stageId,
      url,
    },
  });
};

export const getStageAssets = async ({ stageId }: { stageId: Stage["id"] }) => {
  return await prisma.asset.findMany({
    where: {
      stageId,
    },
  });
};
