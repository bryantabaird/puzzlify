import StageForm from "@/components/StageForm";
import prisma from "@/lib/prisma";

export default async function CreateStagePage({
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

  return (
    <div>
      <h1>{adventure.name}</h1>
      <pre>{JSON.stringify(adventure, null, 4)}</pre>
      <StageForm adventureId={adventure.id} />
    </div>
  );
}
