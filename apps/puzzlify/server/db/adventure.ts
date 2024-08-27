"use server";

import prisma from "@/lib/prisma";
import { Adventure, User } from "@prisma/client";

export const getAdventureWithStages = async (adventureId: Adventure["id"]) => {
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

export const deleteAdventureDb = async (adventureId: Adventure["id"]) => {
  return await prisma.adventure.delete({
    where: { id: adventureId },
  });
};

type UpdateAdventurePayload = Pick<Adventure, "name" | "startDate">;
export const updateAdventureDb = async (
  adventureId: Adventure["id"],
  data: UpdateAdventurePayload,
) => {
  return await prisma.adventure.update({
    where: { id: adventureId },
    data,
  });
};

export const getHostAdventureId = async (
  adventureId: Adventure["id"],
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

export const addParticipantToAdventure = async (
  userId: User["id"],
  adventureId: Adventure["id"],
) => {
  return await prisma.adventure.update({
    where: { id: adventureId },
    data: {
      participants: {
        connect: { id: userId },
      },
    },
  });
};

export const getParticipantAdventureId = async (
  userId: User["id"],
  adventureId: Adventure["id"],
) => {
  return await prisma.adventure.findFirst({
    where: {
      id: adventureId,
      participants: {
        some: {
          id: userId,
        },
      },
    },
    select: { id: true },
  });
};

export const getAdventureStartDateTime = async (
  adventureId: Adventure["id"],
) => {
  return await prisma.adventure.findUnique({
    where: { id: adventureId },
    select: { startDate: true },
  });
};
