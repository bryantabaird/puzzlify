import { PrismaClient, Track, Step } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

const seed = async () => {
  await prisma.asset.deleteMany();
  await prisma.teamAdventure.deleteMany();
  await prisma.teamUser.deleteMany();
  await prisma.userAdventure.deleteMany();
  await prisma.teamProgress.deleteMany();
  await prisma.hint.deleteMany();
  await prisma.puzzle.deleteMany();
  await prisma.track.deleteMany();
  await prisma.step.deleteMany();
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

  const steps: Step[] = [
    { id: "step-1", label: "Step 1", order: 1, adventureId: "adventure-id-1" },
    { id: "step-2", label: "Step 2", order: 2, adventureId: "adventure-id-1" },
    { id: "step-3", label: "Step 3", order: 3, adventureId: "adventure-id-1" },
  ];

  const tracks: Track[] = [
    { id: "track-1", label: "Track 1", stepId: "step-1", order: 1 },
    { id: "track-2", label: "Track 2", stepId: "step-1", order: 2 },
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
      maxTeamCount: 1,
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

  await prisma.adventure.create({
    data: {
      name: "Test Adventure 3",
      hostId: "1",
      id: "adventure-id-3",
      startDate: new Date(new Date().getTime() + 10 * 1000),
    },
  });

  await Promise.all(
    steps.map(async (step) => {
      await prisma.step.create({
        data: step,
      });
    }),
  );

  await Promise.all(
    tracks.map(async (track) => {
      await prisma.track.create({
        data: track,
      });
    }),
  );

  await prisma.puzzle.create({
    data: {
      label: "Puzzle 1",
      id: "puzzle-id-1",
      riddle: "What is the answer to life, the universe, and everything?",
      answer: await bcryptjs.hash("42".toLowerCase(), 10),
      trackId: "track-1",
      adventureId: "adventure-id-1",
      order: 1,
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

  await prisma.puzzle.create({
    data: {
      label: "Puzzle 2a",
      id: "puzzle-id-2a",
      riddle: "What is the capital of France?",
      answer: await bcryptjs.hash("Paris".toLowerCase(), 10),
      trackId: "track-1",
      adventureId: "adventure-id-1",
      order: 1,
    },
  });

  await prisma.puzzle.create({
    data: {
      label: "Puzzle 2b",
      id: "puzzle-id-2b",
      riddle: "What is the capital of Germany?",
      answer: await bcryptjs.hash("Berlin".toLowerCase(), 10),
      trackId: "track-1",
      adventureId: "adventure-id-1",
      order: 1,
    },
  });

  await prisma.puzzle.create({
    data: {
      label: "Puzzle 3",
      id: "puzzle-id-3",
      riddle: "What is the capital of Italy?",
      answer: await bcryptjs.hash("Rome".toLowerCase(), 10),
      adventureId: "adventure-id-1",
      order: 1,
    },
  });

  const adventureId = "adventure-id-2";

  await prisma.adventure.create({
    data: {
      id: adventureId,
      name: "Test Adventure",
      hostId: "1",
      startDate: new Date(new Date().getTime() + 10 * 1000),
      steps: {
        connect: [{ id: "step-1" }, { id: "step-2" }, { id: "step-3" }],
      },
    },
  });
};

seed();
