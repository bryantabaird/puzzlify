"use server";

import prisma from "@/lib/prisma";
import { Hint, Puzzle } from "@prisma/client";

type CreateHintPayload = Pick<Hint, "puzzleId" | "hint" | "delay">;
export const createHintDb = async (data: CreateHintPayload) => {
  return await prisma.hint.create({ data });
};

export const deleteHintDb = async (hintId: string) => {
  return await prisma.hint.delete({
    where: { id: hintId },
  });
};

export const deleteHintsFromPuzzlesDb = async (
  puzzleIds: Array<Puzzle["id"]>,
) => {
  return await prisma.hint.deleteMany({
    where: { puzzleId: { in: puzzleIds } },
  });
};

type UpdateHintPayload = Pick<Hint, "hint" | "delay">;
export const updateHintDb = async (hintId: string, data: UpdateHintPayload) => {
  return await prisma.hint.update({
    where: { id: hintId },
    data,
  });
};

export const getHintDb = async (hintId: string) => {
  return await prisma.hint.findUnique({
    where: { id: hintId },
  });
};

export const getHostHintId = async (hintId: string, userId: string) => {
  return await prisma.hint.findFirst({
    where: {
      id: hintId,
      puzzle: {
        adventure: {
          hostId: userId,
        },
      },
    },
    select: { id: true },
  });
};
