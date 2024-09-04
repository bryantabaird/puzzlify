import prisma from "@/lib/prisma";
import { Adventure, User } from "@prisma/client";

export const getTeamUserFromAdventureUser = async ({
  userId,
  adventureId,
}: {
  userId: User["id"];
  adventureId: Adventure["id"];
}) => {
  return await prisma.teamUser.findFirst({
    where: {
      userId: userId,
      team: {
        adventures: {
          some: {
            adventureId: adventureId,
          },
        },
      },
    },
    select: {
      teamId: true,
    },
  });
};
