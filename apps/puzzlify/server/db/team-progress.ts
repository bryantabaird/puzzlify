import prisma from "@/lib/prisma";
import { Adventure, Stage, TeamProgress, Team } from "@prisma/client";

type GetTeamStageInProgressParams = {
  teamId: Team["id"];
  adventureId: Adventure["id"];
};
export const getTeamStagesInProgress = async ({
  teamId,
  adventureId,
}: GetTeamStageInProgressParams) => {
  return await prisma.teamProgress.findMany({
    where: {
      teamId,
      adventureId,
      completionTime: null,
    },
    include: {
      stage: true,
    },
  });
};

type GetTeamStageInProgressPayload = {
  teamId: Team["id"];
  adventureId: Adventure["id"];
  stageId: Stage["id"];
};

export const getTeamStageInProgress = async ({
  teamId,
  adventureId,
  stageId,
}: GetTeamStageInProgressPayload) => {
  return await prisma.teamProgress.findFirst({
    where: {
      teamId,
      adventureId,
      stageId,
      completionTime: null,
    },
  });
};

export const getCountOfIncompletePreviousStages = async ({
  adventureId,
  teamId,
  previousStageIds,
}: {
  adventureId: Adventure["id"];
  teamId: Team["id"];
  previousStageIds: Array<Stage["id"]>;
}) => {
  return await prisma.teamProgress.count({
    where: {
      teamId,
      adventureId,
      stageId: { in: previousStageIds },
      completionTime: null,
    },
  });
};

export const createTeamProgress = async ({
  teamId,
  adventureId,
  stageId,
  startTime,
}: {
  teamId: Team["id"];
  adventureId: Adventure["id"];
  stageId: Stage["id"];
  startTime: Date;
}) => {
  return await prisma.teamProgress.create({
    data: {
      teamId,
      adventureId,
      stageId,
      startTime,
    },
  });
};

export const updateTeamProgress = async (
  teamId: Team["id"],
  adventureId: Adventure["id"],
  stageId: Stage["id"],
  completionTime: Date,
) => {
  return prisma.teamProgress.update({
    where: {
      teamProgressId: {
        teamId,
        adventureId,
        stageId,
      },
    },
    data: { completionTime },
  });
};

type CreateTeamProgressesPayload = Array<
  Pick<TeamProgress, "teamId" | "adventureId" | "stageId">
>;
// TODO: For signup, the start time should be the adventure start time,
// but if we consider editing the start time on the adventure, ensure data integrity
// here such that a team progress start time becomes out of sync. Maybe the
// start time for starting stages could be a special ADVENTURE_START_TIME value
export const createTeamProgresses = async (
  data: CreateTeamProgressesPayload,
) => {
  return await prisma.teamProgress.createMany({ data });
};

export const getTeamStageStartTime = async ({
  teamId,
  stageId,
  adventureId,
}: {
  teamId: Team["id"];
  adventureId: Adventure["id"];
  stageId: Stage["id"];
}) => {
  return await prisma.teamProgress.findFirst({
    where: {
      teamId,
      adventureId,
      stageId,
    },
    select: { startTime: true },
  });
};
