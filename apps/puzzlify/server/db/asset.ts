import prisma from "@/lib/prisma";
import { Asset, Puzzle } from "@prisma/client";

export const createAssetDb = async ({
  id,
  puzzleId,
  url,
}: {
  id: Asset["id"];
  puzzleId: Puzzle["id"];
  url: string;
}) => {
  await prisma.asset.create({
    data: {
      id,
      puzzleId,
      url,
    },
  });
};

export const getPuzzleAssets = async ({
  puzzleId,
}: {
  puzzleId: Puzzle["id"];
}) => {
  return await prisma.asset.findMany({
    where: {
      puzzleId,
    },
  });
};
