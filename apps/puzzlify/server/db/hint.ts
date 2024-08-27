"use server";

import prisma from "@/lib/prisma";
import { Hint } from "@prisma/client";

type CreateHintPayload = Pick<Hint, "stageId" | "hint" | "delay">;
export const createHintDb = async (data: CreateHintPayload) => {
  return await prisma.hint.create({ data });
};

export const deleteHintDb = async (hintId: string) => {
  return await prisma.hint.delete({
    where: { id: hintId },
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
      stage: {
        adventure: {
          hostId: userId,
        },
      },
    },
    select: { id: true },
  });
};
