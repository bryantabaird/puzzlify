import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export const createTeam = async ({
  name,
  userId,
}: {
  name: string;
  userId: User["id"];
}) => {
  return await prisma.team.create({
    data: {
      name,
      users: {
        create: {
          user: { connect: { id: userId } },
        },
      },
    },
  });
};
