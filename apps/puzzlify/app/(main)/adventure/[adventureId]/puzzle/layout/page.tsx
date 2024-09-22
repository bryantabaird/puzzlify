import { Adventure } from "@prisma/client";
import Builder from "./_components/drag-drop/Builder";
import { getAdventureStages } from "@/server/db/stage";

export default async function PuzzleLayout({
  params: { adventureId },
}: {
  params: { adventureId: Adventure["id"] };
}) {
  const rawPuzzles = await getAdventureStages(adventureId);

  const puzzles = rawPuzzles.map((rawPuzzle) => ({
    id: rawPuzzle.id,
    label: rawPuzzle.label,
    previousStageIds: rawPuzzle.previousStages.map(
      (relation) => relation.fromStage.id,
    ),
    nextStageIds: rawPuzzle.nextStages.map((relation) => relation.toStage.id),
  }));

  return <Builder initialPuzzles={puzzles} />;
}
