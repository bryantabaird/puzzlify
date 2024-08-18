import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const seed = async () => {
  await prisma.user.deleteMany();
  await prisma.adventure.deleteMany();

  const users = [
    {
      id: "1",
      email: "test1@test.com",
      password: await bcrypt.hash("asdf", 10),
    },
    {
      id: "2",
      email: "test2@test.com",
      password: await bcrypt.hash("asdf", 10),
    },
    {
      id: "3",
      email: "test3@test.com",
      password: await bcrypt.hash("asdf", 10),
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }
};

seed();
