import prisma from "@/lib/prisma";
import { Adventure, User } from "@prisma/client";

export const getUserAdventure = async ({
  userId,
  adventureId,
}: {
  userId: User["id"];
  adventureId: Adventure["id"];
}) => {
  return await prisma.userAdventure.findFirst({
    where: {
      userId,
      adventureId,
    },
  });
};

export const createAdventureUsers = async ({
  userIds,
  adventureId,
}: {
  userIds: Array<User["id"]>;
  adventureId: Adventure["id"];
}) => {
  return await prisma.userAdventure.createMany({
    data: userIds.map((userId) => ({
      userId,
      adventureId,
    })),
  });
};
