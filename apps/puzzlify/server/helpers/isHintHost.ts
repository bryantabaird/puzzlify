import prisma from "@/lib/prisma";

type Props = {
  userId: string;
  hintId: string;
};

export async function isHintHost({ hintId, userId }: Props): Promise<boolean> {
  const hint = await prisma.hint.findFirst({
    where: {
      id: hintId,
      stage: {
        adventure: {
          hostId: userId,
        },
      },
    },
    select: {
      id: true,
    },
  });

  return !!hint;
}
