import prisma from "@/lib/prisma";
import { Adventure } from "@prisma/client";

export const getAdventureWithStages = async (adventureId: string) => {
  return prisma.adventure.findUnique({
    where: { id: adventureId },
    include: {
      stages: true,
    },
  });
};

type CreateAdventurePayload = Pick<Adventure, "name" | "hostId" | "startDate">;
export const createAdventureDb = async (data: CreateAdventurePayload) => {
  return await prisma.adventure.create({ data });
};

export const deleteAdventureDb = async (adventureId: string) => {
  return await prisma.adventure.delete({
    where: { id: adventureId },
  });
};

type UpdateAdventurePayload = Pick<Adventure, "name" | "startDate">;
export const updateAdventureDb = async (
  adventureId: string,
  data: UpdateAdventurePayload,
) => {
  return await prisma.adventure.update({
    where: { id: adventureId },
    data,
  });
};

export const getHostAdventureId = async (
  adventureId: string,
  userId: string,
) => {
  return await prisma.adventure.findFirst({
    where: {
      id: adventureId,
      hostId: userId,
    },
    select: { id: true },
  });
};

export const getHostAdventures = async (userId: string) => {
  return await prisma.adventure.findMany({
    where: { hostId: userId },
  });
};

// TODO: Update user model to include participant adventures
export const getParticipantAdventures = async (userId: string) => {
  return await prisma.adventure.findMany({
    where: {
      NOT: {
        hostId: userId,
      },
    },
  });
};
