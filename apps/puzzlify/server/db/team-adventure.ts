import prisma from "@/lib/prisma";
import { Team, Adventure, TeamAdventure } from "@prisma/client";

export const getTeamAdventure = async ({
  teamId,
  adventureId,
}: {
  teamId: Team["id"];
  adventureId: Adventure["id"];
}) => {
  return await prisma.teamAdventure.findFirst({
    where: {
      teamId,
      adventureId,
    },
  });
};

export const getWaitlistedUsersCount = async (adventureId: string) => {
  const waitlistedTeams = await prisma.teamAdventure.count({
    where: {
      adventureId,
      waitlisted: true,
    },
  });

  return waitlistedTeams;
};

export const createTeamAdventure = async ({
  teamId,
  adventureId,
  waitlisted = false,
}: {
  teamId: Team["id"];
  adventureId: Adventure["id"];
  waitlisted?: TeamAdventure["waitlisted"];
}) => {
  return await prisma.teamAdventure.create({
    data: {
      teamId,
      adventureId,
      waitlisted,
    },
  });
};

export const deleteTeamAdventure = async ({
  teamId,
  adventureId,
}: {
  teamId: Team["id"];
  adventureId: Adventure["id"];
}) => {
  return await prisma.teamAdventure.deleteMany({
    where: {
      teamId,
      adventureId,
    },
  });
};
