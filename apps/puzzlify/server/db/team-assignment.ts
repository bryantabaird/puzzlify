import prisma from "@/lib/prisma";
import { Adventure } from "@prisma/client";
import { User } from "next-auth";

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
