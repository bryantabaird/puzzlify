import prisma from "@/lib/prisma";
import { Adventure } from "@prisma/client";

export const getFirstStepPuzzles = async ({
  adventureId,
}: {
  adventureId: Adventure["id"];
}) => {
  const steps = await prisma.step.findMany({
    where: {
      adventureId: adventureId, // Filter by adventure ID
    },
    orderBy: {
      order: "asc",
    },
    take: 1,
    include: {
      tracks: {
        include: {
          puzzles: true,
        },
      },
    },
  });

  if (!steps.length) {
    throw new Error("No steps found for adventure");
  }

  return steps[0];
};
