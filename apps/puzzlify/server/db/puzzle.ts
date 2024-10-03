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

// TODO: Prevent delete either if adventure started
// or if a team has arrived at this puzzle after start
export const deletePuzzleDb = async (puzzleId: string) => {
  await deleteHintsFromPuzzlesDb([puzzleId]);
  return await prisma.puzzle.delete({
    where: { id: puzzleId },
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

export const getHostPuzzleId = async ({
  puzzleId,
  userId,
}: {
  puzzleId: string;
  userId: string;
}) => {
  const hostPuzzle = await prisma.puzzle.findFirst({
    where: {
      id: puzzleId,
      adventure: {
        hostId: userId,
      },
    },
    select: { id: true },
  });

  if (!hostPuzzle) {
    throw new Error("User is not the host of this puzzle");
  }

  return hostPuzzle.id;
};

export const getHostPuzzleIds = async ({
  puzzleIds,
  userId,
}: {
  puzzleIds: string[];
  userId: string;
}) => {
  const response = await prisma.puzzle.findMany({
    where: {
      id: { in: puzzleIds },
      adventure: {
        hostId: userId,
      },
    },
    select: { id: true },
  });

  const hostPuzzleIds = response.map((puzzle) => puzzle.id);

  const missingPuzzles = puzzleIds.filter((id) => !hostPuzzleIds.includes(id));

  if (missingPuzzles.length > 0) {
    throw new Error(
      `User is not the host for puzzles with IDs: ${missingPuzzles.join(", ")}`,
    );
  }

  return hostPuzzleIds;
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
      track: {
        select: {
          id: true,
          label: true,
        },
      },
      order: true,
    },
  });
};

export type AdventurePuzzles = Awaited<ReturnType<typeof getAdventurePuzzles>>;

export type PuzzlePositionPayload = Array<{
  puzzleId: string;
  order: number;
  trackId: string;
}>;

export const updatePuzzlePositions = async (payload: PuzzlePositionPayload) => {
  return await prisma.$transaction(async () => {
    await Promise.all(
      payload.map(async ({ puzzleId, order, trackId }) => {
        await prisma.puzzle.update({
          where: { id: puzzleId },
          data: {
            order,
            trackId,
          },
        });
      }),
    );
  });
};
