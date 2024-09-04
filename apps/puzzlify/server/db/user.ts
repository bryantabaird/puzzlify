"use server";

import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export const getUserByEmail = async (email: User["email"]) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

type CreateUserPayload = Pick<User, "email" | "password">;
export const createUserInDb = async (data: CreateUserPayload) => {
  return await prisma.user.create({ data });
};

export const getUserAdventure = async ({
  userId,
  adventureId,
}: {
  userId: User["id"];
  adventureId: User["id"];
}) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      teams: {
        include: {
          team: {
            include: {
              adventures: {
                where: { adventureId: adventureId },
              },
            },
          },
        },
      },
    },
  });
};
