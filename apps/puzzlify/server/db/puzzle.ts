"use server";

import prisma from "@/lib/prisma";
import { Prisma, Puzzle } from "@prisma/client";
import { deletePuzzleRelationsFromPuzzleDb } from "./puzzle-relation";
import { deleteHintsFromPuzzlesDb } from "./hint";

export type PuzzleWithPreviousAndNextPuzzles = Awaited<
  ReturnType<typeof getPuzzleWithPreviousAndNextPuzzles>
>;

export const getPuzzleWithPreviousAndNextPuzzles = async (
  puzzleId: Puzzle["id"],
) => {
  return await prisma.puzzle.findUnique({
    where: { id: puzzleId },
    include: {
      hints: true,
      previousPuzzles: {
        include: {
          fromPuzzle: true,
        },
      },
      nextPuzzles: {
        include: {
          toPuzzle: true,
        },
      },
    },
  });
};

export const getPuzzleValidationData = async (puzzleId: Puzzle["id"]) => {
  return await prisma.puzzle.findUnique({
    where: { id: puzzleId },
    select: { answer: true, id: true, nextPuzzles: true },
  });
};

export const getPuzzleWithHints = async (puzzleId: Puzzle["id"]) => {
  return await prisma.puzzle.findUnique({
    where: { id: puzzleId },
    include: {
      hints: true,
    },
  });
};

type CreatePuzzlePayload = Pick<
  Puzzle,
  "label" | "riddle" | "answer" | "adventureId"
>;
export const createPuzzleDb = async (data: CreatePuzzlePayload) => {
  return await prisma.puzzle.create({ data });
};

export const deletePuzzleDb = async (puzzleId: string) => {
  return await prisma.$transaction(async (prismaPuzzleClient) => {
    await deletePuzzleRelationsFromPuzzleDb({
      puzzleId,
      prismaClient: prismaPuzzleClient,
    });
    return await prismaPuzzleClient.puzzle.delete({
      where: {
        id: puzzleId,
      },
    });
  });
};

// TODO: Prevent delete either if adventure started
// or if a team has arrived at this puzzle after start
export const deletePuzzlesDb = async ({
  puzzleIds,
  prismaClient = prisma,
}: {
  puzzleIds: string[];
  prismaClient?: Prisma.TransactionClient;
}) => {
  // TODO: Make transactional
  await deleteHintsFromPuzzlesDb(puzzleIds);
  return await prismaClient.puzzle.deleteMany({
    where: {
      id: { in: puzzleIds },
    },
  });
};

type UpdatePuzzlePayload =
  | Pick<Puzzle, "label">
  | Pick<Puzzle, "label" | "riddle" | "answer">;
export const updatePuzzleDb = async (
  puzzleId: string,
  data: UpdatePuzzlePayload,
) => {
  return await prisma.puzzle.update({
    where: { id: puzzleId },
    data,
  });
};

export const getHostPuzzleId = async (puzzleId: string, userId: string) => {
  return await prisma.puzzle.findFirst({
    where: {
      id: puzzleId,
      adventure: {
        hostId: userId,
      },
    },
    select: { id: true },
  });
};

export const getStartPuzzles = async (adventureId: string) => {
  return await prisma.puzzle.findMany({
    where: {
      adventureId,
      previousPuzzles: {
        none: {},
      },
    },
  });
};

export const getAdventurePuzzles = async (adventureId: string) => {
  return await prisma.puzzle.findMany({
    where: { adventureId },
    select: {
      id: true,
      label: true,
      previousPuzzles: {
        select: {
          fromPuzzle: {
            select: { id: true },
          },
        },
      },
      nextPuzzles: {
        select: {
          toPuzzle: {
            select: { id: true },
          },
        },
      },
    },
  });
};
