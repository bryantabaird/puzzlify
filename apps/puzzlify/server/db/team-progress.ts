"use server";

import prisma from "@/lib/prisma";
import { Adventure, Puzzle, TeamProgress, Team } from "@prisma/client";

type GetTeamPuzzleInProgressParams = {
  teamId: Team["id"];
  adventureId: Adventure["id"];
};
export const getTeamPuzzlesInProgress = async ({
  teamId,
  adventureId,
}: GetTeamPuzzleInProgressParams) => {
  return await prisma.teamProgress.findMany({
    where: {
      teamId,
      adventureId,
      completionTime: null,
    },
    include: {
      puzzle: true,
    },
  });
};

type GetTeamPuzzleInProgressPayload = {
  teamId: Team["id"];
  adventureId: Adventure["id"];
  puzzleId: Puzzle["id"];
};

export const getTeamPuzzleInProgress = async ({
  teamId,
  adventureId,
  puzzleId,
}: GetTeamPuzzleInProgressPayload) => {
  return await prisma.teamProgress.findFirst({
    where: {
      teamId,
      adventureId,
      puzzleId,
      completionTime: null,
    },
  });
};

export const getCountOfIncompletePreviousPuzzles = async ({
  adventureId,
  teamId,
  previousPuzzleIds,
}: {
  adventureId: Adventure["id"];
  teamId: Team["id"];
  previousPuzzleIds: Array<Puzzle["id"]>;
}) => {
  return await prisma.teamProgress.count({
    where: {
      teamId,
      adventureId,
      puzzleId: { in: previousPuzzleIds },
      completionTime: null,
    },
  });
};

export const createTeamProgress = async ({
  teamId,
  adventureId,
  puzzleId,
  startTime,
}: {
  teamId: Team["id"];
  adventureId: Adventure["id"];
  puzzleId: Puzzle["id"];
  startTime: Date;
}) => {
  return await prisma.teamProgress.create({
    data: {
      teamId,
      adventureId,
      puzzleId,
      startTime,
    },
  });
};

export const updateTeamProgress = async (
  teamId: Team["id"],
  adventureId: Adventure["id"],
  puzzleId: Puzzle["id"],
  completionTime: Date,
) => {
  return prisma.teamProgress.update({
    where: {
      teamProgressId: {
        teamId,
        adventureId,
        puzzleId,
      },
    },
    data: { completionTime },
  });
};

type CreateTeamProgressesPayload = Array<
  Pick<TeamProgress, "teamId" | "adventureId" | "puzzleId">
>;
// TODO: For signup, the start time should be the adventure start time,
// but if we consider editing the start time on the adventure, ensure data integrity
// here such that a team progress start time becomes out of sync. Maybe the
// start time for starting puzzles could be a special ADVENTURE_START_TIME value
export const createTeamProgresses = async (
  data: CreateTeamProgressesPayload,
) => {
  return await prisma.teamProgress.createMany({ data });
};

export const getTeamPuzzleStartTime = async ({
  teamId,
  puzzleId,
  adventureId,
}: {
  teamId: Team["id"];
  adventureId: Adventure["id"];
  puzzleId: Puzzle["id"];
}) => {
  return await prisma.teamProgress.findFirst({
    where: {
      teamId,
      adventureId,
      puzzleId,
    },
    select: { startTime: true },
  });
};
