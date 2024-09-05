import prisma from "@/lib/prisma";
import { Tier } from "@prisma/client";

export const getTier = async ({ tierId }: { tierId: Tier["id"] }) => {
  return await prisma.tier.findFirst({
    where: { id: tierId },
  });
};
