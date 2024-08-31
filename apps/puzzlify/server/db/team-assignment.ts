import prisma from "@/lib/prisma";
import { User, Adventure, Team } from "@prisma/client";

type GetTeamAssignmentPayload = {
  userId: User["id"];
  adventureId: Adventure["id"];
};
export const getTeamAssignment = async ({
  userId,
  adventureId,
}: GetTeamAssignmentPayload) => {
  return await prisma.teamAssignment.findFirst({
    where: {
      userId,
      adventureId,
    },
  });
};

type CreateTeamAssignmentPayload = {
  userId: User["id"];
  adventureId: Adventure["id"];
  teamId: Team["id"];
};
export const createTeamAssignment = async ({
  userId,
  adventureId,
  teamId,
}: CreateTeamAssignmentPayload) => {
  return await prisma.teamAssignment.create({
    data: {
      userId,
      adventureId,
      teamId,
    },
  });
};
