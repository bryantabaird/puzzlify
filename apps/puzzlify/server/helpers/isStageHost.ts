import prisma from "@/lib/prisma";

type IsStageHost = {
  userId: string;
  stageId: string;
};

export async function isStageHost({
  stageId,
  userId,
}: IsStageHost): Promise<boolean> {
  const adventure = await prisma.adventure.findFirst({
    where: {
      hostId: userId,
      stages: {
        some: { id: stageId },
      },
    },
    select: { id: true },
  });

  return !!adventure;
}
