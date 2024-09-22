import { Adventure } from "@prisma/client";
import PuzzlesView from "./_components/PuzzlesView";
import { getAdventurePuzzles } from "@/server/db/puzzle";

export default async function PuzzlesPage({
  params: { adventureId },
}: {
  params: { adventureId: Adventure["id"] };
}) {
  const puzzles = await getAdventurePuzzles(adventureId);

  if (!puzzles) {
    return <div>No puzzles found for this adventure</div>;
  }

  return <PuzzlesView puzzles={puzzles} adventureId={adventureId} />;
}
