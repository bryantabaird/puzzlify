import prisma from "@/lib/prisma";

type GetAdventureHostProps = {
  userId: string;
  adventureId: string;
};

export async function getAdventureHost({
  adventureId,
  userId,
}: GetAdventureHostProps): Promise<boolean> {
  const adventure = await prisma.adventure.findUnique({
    where: { id: adventureId },
    select: { hostId: true },
  });

  if (!adventure) {
    return false;
  }

  return adventure.hostId === userId;
}
