import prisma from "@/lib/prisma";
import { Puzzle } from "@prisma/client";
import { deletePuzzlesDb } from "./puzzle";
import { deleteHintsFromPuzzlesDb } from "./hint";

type DeletePuzzlesParams = {
  puzzleIds: Array<Puzzle["id"]>;
};
export const deletePuzzles = async ({ puzzleIds }: DeletePuzzlesParams) => {
  return await prisma.$transaction(async (prismaPuzzleClient) => {
    await deleteHintsFromPuzzlesDb(puzzleIds);
    await deletePuzzlesDb({ puzzleIds, prismaClient: prismaPuzzleClient });
  });
};
