"use server";

import prisma from "@/lib/prisma";
import { Adventure, User } from "@prisma/client";

export const getAdventureWithPuzzles = async (adventureId: Adventure["id"]) => {
  return prisma.adventure.findUnique({
    where: { id: adventureId },
    include: {
      puzzles: true,
    },
  });
};

export const getAdventureTeamData = async (adventureId: Adventure["id"]) => {
  return await prisma.adventure.findUnique({
    where: { id: adventureId },
    select: {
      tier: {
        select: {
          maxTeamCount: true,
        },
      },
      _count: {
        select: {
          teams: true,
        },
      },
    },
  });
};

export const getAdventureTeams = async (adventureId: Adventure["id"]) => {
  return await prisma.teamAdventure.findMany({
    where: { adventureId },
    include: {
      team: {
        select: {
          id: true,
          name: true,
          users: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });
};

export type AdventureTeams = Awaited<ReturnType<typeof getAdventureTeams>>;

export const getAdventureStats = async (adventureId: Adventure["id"]) => {
  try {
    const adventure = await prisma.adventure.findUnique({
      where: { id: adventureId },
      include: {
        teams: true,
        puzzles: true,
        tier: true,
      },
    });

    if (!adventure) {
      throw new Error("Adventure not found");
    }

    return adventure;
  } catch (e) {
    console.error(e);
    throw e;
  }
};

export type AdventureLayout = Awaited<ReturnType<typeof getAdventureLayoutDb>>;

export const getAdventureLayoutDb = async (adventureId: Adventure["id"]) => {
  return prisma.adventure.findUnique({
    where: { id: adventureId },
    include: {
      puzzles: true,
    },
  });
};

export type CreateAdventurePayload = Pick<
  Adventure,
  "name" | "hostId" | "startDate"
>;
export const createAdventureDb = async (data: CreateAdventurePayload) => {
  return await prisma.adventure.create({ data });
};

export const deleteAdventureDb = async (adventureId: Adventure["id"]) => {
  return await prisma.adventure.delete({ where: { id: adventureId } });
};

export const deleteAdventuresDb = async (
  adventureIds: Array<Adventure["id"]>,
) => {
  return await prisma.adventure.deleteMany({
    where: { id: { in: adventureIds } },
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

export const getHostAdventureId = async ({
  adventureId,
  userId,
}: {
  adventureId: string;
  userId: string;
}) => {
  const hostAdventure = await prisma.adventure.findFirst({
    where: {
      id: adventureId,
      hostId: userId,
    },
    select: { id: true },
  });

  if (!hostAdventure) {
    throw new Error("User is not the host of this adventure");
  }

  return hostAdventure.id;
};

export const getHostAdventures = async (userId: string) => {
  return await prisma.adventure.findMany({
    where: { hostId: userId },
  });
};

// TODO: Update this
export const getTeamAdventures = async (userId: string) => {
  return await prisma.adventure.findMany({
    where: {
      NOT: {
        hostId: userId,
      },
    },
  });
};

export const getTeamAdventureId = async (
  userId: User["id"],
  adventureId: Adventure["id"],
) => {
  return await prisma.adventure.findFirst({
    where: {
      id: adventureId,
      teams: {
        some: {
          id: userId,
        },
      },
    },
    select: { id: true },
  });
};

export const getAdventureName = async (adventureId: Adventure["id"]) => {
  return await prisma.adventure.findUnique({
    where: { id: adventureId },
    select: { name: true },
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
