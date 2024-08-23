import AdventureForm from "@/components/AdventureForm";
import prisma from "@/lib/prisma";

export default async function EditAdventure({
  params,
}: {
  params: { adventureId: string };
}) {
  const adventureId = params.adventureId;
  const adventure = await prisma.adventure.findUnique({
    where: { id: adventureId },
    include: {
      stages: true,
    },
  });

  if (!adventure) {
    return (
      <div>
        <h1>Adventure not found</h1>
      </div>
    );
  }

  return <AdventureForm adventure={adventure} />;
}
