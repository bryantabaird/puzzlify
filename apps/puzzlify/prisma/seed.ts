import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

const seed = async () => {
  await prisma.asset.deleteMany();
  await prisma.teamAdventure.deleteMany();
  await prisma.teamUser.deleteMany();
  await prisma.teamProgress.deleteMany();
  await prisma.hint.deleteMany();
  await prisma.stageRelation.deleteMany();
  await prisma.stage.deleteMany();
  await prisma.team.deleteMany();
  await prisma.adventure.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tier.deleteMany();

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

  await prisma.tier.create({
    data: {
      id: "FREE",
      name: "Free",
      maxTeamCount: 2,
    },
  });

  await prisma.adventure.create({
    data: {
      name: "Test Adventure",
      hostId: "1",
      id: "adventure-id-1",
      startDate: new Date(new Date().getTime() + 10 * 1000),
    },
  });

  const stage1 = await prisma.stage.create({
    data: {
      label: "Stage 1",
      id: "stage-id-1",
      riddle: "What is the answer to life, the universe, and everything?",
      answer: await bcryptjs.hash("42".toLowerCase(), 10),
      adventureId: "adventure-id-1",
      hints: {
        create: [
          {
            hint: "It's the answer to everything",
            delay: 10,
          },
          {
            hint: "It's a number",
            delay: 20,
          },
        ],
      },
    },
  });

  const stage2a = await prisma.stage.create({
    data: {
      label: "Stage 2a",
      id: "stage-id-2a",
      riddle: "What is the capital of France?",
      answer: await bcryptjs.hash("Paris".toLowerCase(), 10),
      adventureId: "adventure-id-1",
    },
  });

  const stage2b = await prisma.stage.create({
    data: {
      label: "Stage 2b",
      id: "stage-id-2b",
      riddle: "What is the capital of Germany?",
      answer: await bcryptjs.hash("Berlin".toLowerCase(), 10),
      adventureId: "adventure-id-1",
    },
  });

  const stage3 = await prisma.stage.create({
    data: {
      label: "Stage 3",
      id: "stage-id-3",
      riddle: "What is the capital of Italy?",
      answer: await bcryptjs.hash("Rome".toLowerCase(), 10),
      adventureId: "adventure-id-1",
    },
  });

  const adventureId = "adventure-id-2";

  await prisma.adventure.create({
    data: {
      id: adventureId,
      name: "Test Adventure",
      hostId: "1",
      startDate: new Date(new Date().getTime() + 10 * 1000),
      stages: {
        connect: [
          { id: stage1.id },
          { id: stage2a.id },
          { id: stage2b.id },
          { id: stage3.id },
        ],
      },
    },
  });

  await Promise.all([
    prisma.stageRelation.create({
      data: {
        adventureId,
        fromStageId: stage1.id,
        toStageId: stage2a.id,
      },
    }),
    prisma.stageRelation.create({
      data: {
        adventureId,
        fromStageId: stage1.id,
        toStageId: stage2b.id,
      },
    }),

    prisma.stageRelation.create({
      data: {
        adventureId,
        fromStageId: stage2a.id,
        toStageId: stage3.id,
      },
    }),
    prisma.stageRelation.create({
      data: {
        adventureId,
        fromStageId: stage2b.id,
        toStageId: stage3.id,
      },
    }),
  ]);
};

seed();
