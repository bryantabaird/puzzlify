"use server";

import prisma from "@/lib/prisma";
import { Adventure, Prisma, Puzzle, PuzzleRelation } from "@prisma/client";

export const getNextPuzzlesWithNextedPreviousPuzzles = async (
  puzzleId: Puzzle["id"],
) => {
  return await prisma.puzzleRelation.findMany({
    where: {
      fromPuzzleId: puzzleId,
    },
    select: {
      toPuzzleId: true,
      toPuzzle: {
        select: {
          previousPuzzles: {
            where: {
              fromPuzzleId: { not: puzzleId },
            },
            select: {
              fromPuzzleId: true,
            },
          },
        },
      },
    },
  });
};

export const createPuzzleRelationDb = async (
  adventureId: Adventure["id"],
  fromPuzzleId: Puzzle["id"],
  toPuzzleId: Puzzle["id"],
) => {
  return await prisma.puzzleRelation.create({
    data: {
      adventureId,
      fromPuzzleId,
      toPuzzleId,
    },
  });
};

type DeletePuzzleRelationsFromPuzzleDbParams = {
  puzzleId: Puzzle["id"];
  prismaClient?: Prisma.TransactionClient;
};
export const deletePuzzleRelationsFromPuzzleDb = async ({
  puzzleId,
  prismaClient = prisma,
}: DeletePuzzleRelationsFromPuzzleDbParams) => {
  return await prismaClient.puzzleRelation.deleteMany({
    where: {
      OR: [{ fromPuzzleId: puzzleId }, { toPuzzleId: puzzleId }],
    },
  });
};

type DeletePuzzleRelationsDbParams = {
  puzzleRelationIds: Array<PuzzleRelation["id"]>;
  prismaClient?: Prisma.TransactionClient;
};
export const deletePuzzleRelationsDb = async ({
  puzzleRelationIds,
  prismaClient = prisma,
}: DeletePuzzleRelationsDbParams) => {
  return await prismaClient.puzzleRelation.deleteMany({
    where: {
      id: { in: puzzleRelationIds },
    },
  });
};
