import prisma from "@/lib/prisma";
import { Puzzle, PuzzleRelation } from "@prisma/client";
import { deletePuzzleRelationsDb } from "./puzzle-relation";
import { deletePuzzlesDb } from "./puzzle";
import { deleteHintsFromPuzzlesDb } from "./hint";

type DeletePuzzleRelationsAndPuzzlesParams = {
  puzzleRelationIds: Array<PuzzleRelation["id"]>;
  puzzleIds: Array<Puzzle["id"]>;
};
export const deletePuzzleRelationsAndPuzzlesDb = async ({
  puzzleRelationIds,
  puzzleIds,
}: DeletePuzzleRelationsAndPuzzlesParams) => {
  return await prisma.$transaction(async (prismaPuzzleClient) => {
    console.log("deleting puzzle relations", puzzleRelationIds);
    // TODO: I can probably derive the puzzle relations to delete from the puzzle ids
    await deletePuzzleRelationsDb({
      puzzleRelationIds,
      prismaClient: prismaPuzzleClient,
    });
    console.log("deleting puzzles", puzzleIds);
    await deleteHintsFromPuzzlesDb(puzzleIds);
    await deletePuzzlesDb({ puzzleIds, prismaClient: prismaPuzzleClient });
  });
};
