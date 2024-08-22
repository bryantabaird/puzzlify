import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

const seed = async () => {
  await prisma.userProgress.deleteMany();
  await prisma.hint.deleteMany();
  await prisma.stageRelation.deleteMany();
  await prisma.stage.deleteMany();
  await prisma.adventure.deleteMany();
  await prisma.user.deleteMany();

  const users = [
    {
      id: "1",
      email: "test1@test.com",
      password: await bcryptjs.hash("asdf", 10),
    },
    {
      id: "2",
      email: "test2@test.com",
      password: await bcryptjs.hash("asdf", 10),
    },
    {
      id: "3",
      email: "test3@test.com",
      password: await bcryptjs.hash("asdf", 10),
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  await prisma.adventure.create({
    data: {
      name: "Test Adventure",
      hostId: "1",
      id: "adventure-id-1",
    },
  });

  const stage1 = await prisma.stage.create({
    data: {
      id: "stage-id-1",
      riddle: "What is the answer to life, the universe, and everything?",
      answer: await bcryptjs.hash("42".toLowerCase(), 10),
      adventureId: "adventure-id-1",
      hints: {
        create: [
          {
            hint: "It's the answer to everything",
            delay: 5,
          },
          {
            hint: "It's a number",
            delay: 10,
          },
        ],
      },
    },
  });

  const stage2a = await prisma.stage.create({
    data: {
      id: "stage-id-2a",
      riddle: "What is the capital of France?",
      answer: await bcryptjs.hash("Paris".toLowerCase(), 10),
      adventureId: "adventure-id-1",
    },
  });

  const stage2b = await prisma.stage.create({
    data: {
      id: "stage-id-2b",
      riddle: "What is the capital of Germany?",
      answer: await bcryptjs.hash("Berlin".toLowerCase(), 10),
      adventureId: "adventure-id-1",
    },
  });

  const stage3 = await prisma.stage.create({
    data: {
      id: "stage-id-3",
      riddle: "What is the capital of Italy?",
      answer: await bcryptjs.hash("Rome".toLowerCase(), 10),
      adventureId: "adventure-id-1",
    },
  });

  await prisma.adventure.create({
    data: {
      id: "adventure-id-2",
      name: "Test Adventure",
      hostId: "1",
      stages: {
        connect: [stage1, stage2a, stage2b, stage3],
      },
    },
  });

  await Promise.all([
    prisma.stageRelation.create({
      data: {
        fromStageId: stage1.id,
        toStageId: stage2a.id,
      },
    }),
    prisma.stageRelation.create({
      data: {
        fromStageId: stage1.id,
        toStageId: stage2b.id,
      },
    }),

    prisma.stageRelation.create({
      data: {
        fromStageId: stage2a.id,
        toStageId: stage3.id,
      },
    }),
    prisma.stageRelation.create({
      data: {
        fromStageId: stage2b.id,
        toStageId: stage3.id,
      },
    }),
  ]);
};

seed();
