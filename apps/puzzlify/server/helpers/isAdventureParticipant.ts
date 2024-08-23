import prisma from "@/lib/prisma";

type IsAdventureHostProps = {
  userId: string;
  adventureId: string;
};

export async function isAdventureHost({
  adventureId,
  userId,
}: IsAdventureHostProps): Promise<boolean> {
  const adventure = await prisma.adventure.findFirst({
    where: {
      id: adventureId,
      hostId: userId,
    },
    select: { id: true },
  });

  return !!adventure;
}
