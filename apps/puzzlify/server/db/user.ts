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
