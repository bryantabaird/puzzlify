import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

const seed = async () => {
  await prisma.asset.deleteMany();
  await prisma.teamAdventure.deleteMany();
  await prisma.teamUser.deleteMany();
  await prisma.userAdventure.deleteMany();
  await prisma.teamProgress.deleteMany();
  await prisma.hint.deleteMany();
  await prisma.puzzleRelation.deleteMany();
  await prisma.puzzle.deleteMany();
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

  const freeTier = await prisma.tier.create({
    data: {
      id: "FREE",
      name: "Free",
      maxTeamCount: 1,
    },
  });

  await prisma.adventure.create({
    data: {
      name: "Test Adventure",
      hostId: "1",
      id: "adventure-id-1",
      flow: "LINEAR",
      startDate: new Date(new Date().getTime() + 10 * 1000),
    },
  });

  await prisma.adventure.create({
    data: {
      name: "Test Adventure 3",
      hostId: "1",
      id: "adventure-id-3",
      flow: "PARALLEL",
      startDate: new Date(new Date().getTime() + 10 * 1000),
    },
  });

  const puzzle1 = await prisma.puzzle.create({
    data: {
      label: "Puzzle 1",
      id: "puzzle-id-1",
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

  const puzzle2a = await prisma.puzzle.create({
    data: {
      label: "Puzzle 2a",
      id: "puzzle-id-2a",
      riddle: "What is the capital of France?",
      answer: await bcryptjs.hash("Paris".toLowerCase(), 10),
      adventureId: "adventure-id-1",
    },
  });

  const puzzle2b = await prisma.puzzle.create({
    data: {
      label: "Puzzle 2b",
      id: "puzzle-id-2b",
      riddle: "What is the capital of Germany?",
      answer: await bcryptjs.hash("Berlin".toLowerCase(), 10),
      adventureId: "adventure-id-1",
    },
  });

  const puzzle3 = await prisma.puzzle.create({
    data: {
      label: "Puzzle 3",
      id: "puzzle-id-3",
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
      flow: "PARALLEL",
      startDate: new Date(new Date().getTime() + 10 * 1000),
      puzzles: {
        connect: [
          { id: puzzle1.id },
          { id: puzzle2a.id },
          { id: puzzle2b.id },
          { id: puzzle3.id },
        ],
      },
    },
  });

  await Promise.all([
    prisma.puzzleRelation.create({
      data: {
        adventureId,
        fromPuzzleId: puzzle1.id,
        toPuzzleId: puzzle2a.id,
      },
    }),
    prisma.puzzleRelation.create({
      data: {
        adventureId,
        fromPuzzleId: puzzle1.id,
        toPuzzleId: puzzle2b.id,
      },
    }),

    prisma.puzzleRelation.create({
      data: {
        adventureId,
        fromPuzzleId: puzzle2a.id,
        toPuzzleId: puzzle3.id,
      },
    }),
    prisma.puzzleRelation.create({
      data: {
        adventureId,
        fromPuzzleId: puzzle2b.id,
        toPuzzleId: puzzle3.id,
      },
    }),
  ]);
};

seed();
