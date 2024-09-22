import { Adventure } from "@prisma/client";
import Builder from "./_components/drag-drop/Builder";
import { getAdventurePuzzles } from "@/server/db/puzzle";

export default async function PuzzleLayout({
  params: { adventureId },
}: {
  params: { adventureId: Adventure["id"] };
}) {
  const rawPuzzles = await getAdventurePuzzles(adventureId);

  const puzzles = rawPuzzles.map((rawPuzzle) => ({
    id: rawPuzzle.id,
    label: rawPuzzle.label,
    previousPuzzleIds: rawPuzzle.previousPuzzles.map(
      (relation) => relation.fromPuzzle.id,
    ),
    nextPuzzleIds: rawPuzzle.nextPuzzles.map(
      (relation) => relation.toPuzzle.id,
    ),
  }));

  return <Builder initialPuzzles={puzzles} />;
}
