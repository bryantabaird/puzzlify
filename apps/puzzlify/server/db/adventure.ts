"use server";

import prisma from "@/lib/prisma";
import { Adventure, Team, User } from "@prisma/client";

export const getAdventureWithStages = async (adventureId: Adventure["id"]) => {
  return prisma.adventure.findUnique({
    where: { id: adventureId },
    include: {
      stages: true,
    },
  });
};

export type AdventureLayout = Awaited<ReturnType<typeof getAdventureLayoutDb>>;

export const getAdventureLayoutDb = async (adventureId: Adventure["id"]) => {
  return prisma.adventure.findUnique({
    where: { id: adventureId },
    include: {
      stages: {
        include: {
          previousStages: true,
          nextStages: true,
        },
      },
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

type AddTeamToAdventureParams = {
  teamId: Team["id"];
  adventureId: Adventure["id"];
};
export const addTeamToAdventure = async ({
  teamId,
  adventureId,
}: AddTeamToAdventureParams) => {
  return await prisma.adventure.update({
    where: { id: adventureId },
    data: {
      teams: {
        connect: { id: teamId },
      },
    },
  });
};

export const getUserAdventureTeam = async ({
  userId,
  adventureId,
}: {
  userId: User["id"];
  adventureId: Adventure["id"];
}) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      teams: {
        select: {
          adventures: {
            where: { id: adventureId },
          },
        },
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

export const getAdventureStartDateTime = async (
  adventureId: Adventure["id"],
) => {
  return await prisma.adventure.findUnique({
    where: { id: adventureId },
    select: { startDate: true },
  });
};
