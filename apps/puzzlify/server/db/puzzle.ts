"use server";

import prisma from "@/lib/prisma";
import { Prisma, Puzzle } from "@prisma/client";
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
    },
  });
};

export const getPuzzleValidationData = async (puzzleId: Puzzle["id"]) => {
  return await prisma.puzzle.findUnique({
    where: { id: puzzleId },
    select: { answer: true, id: true },
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
  // TODO: Remove transaction here for a single op
  return await prisma.$transaction(async (prismaPuzzleClient) => {
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
    },
  });
};

export const getAdventurePuzzles = async (adventureId: string) => {
  return await prisma.puzzle.findMany({
    where: { adventureId },
    select: {
      id: true,
      label: true,
    },
  });
};
