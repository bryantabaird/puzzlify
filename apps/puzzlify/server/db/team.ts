import prisma from "@/lib/prisma";
import { Adventure, User } from "@prisma/client";

type CreateTeamPayload = {
  name: string;
  adventureId: Adventure["id"];
  userId: User["id"];
};
export const createTeam = async ({
  name,
  adventureId,
  userId,
}: CreateTeamPayload) => {
  return await prisma.team.create({
    data: {
      name,
      adventures: {
        connect: { id: adventureId },
      },
      assignments: {
        create: {
          userId: userId,
          adventureId: adventureId,
        },
      },
    },
  });
};
