import { Adventure } from "@prisma/client";
import PuzzlesView from "./_components/PuzzlesView";
import { getAdventureStages } from "@/server/db/stage";

export default async function PuzzlesPage({
  params: { adventureId },
}: {
  params: { adventureId: Adventure["id"] };
}) {
  const stages = await getAdventureStages(adventureId);

  if (!stages) {
    return <div>No stages found for this adventure</div>;
  }

  return <PuzzlesView puzzles={stages} adventureId={adventureId} />;
}
