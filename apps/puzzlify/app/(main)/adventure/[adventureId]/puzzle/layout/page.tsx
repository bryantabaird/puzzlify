import { Adventure } from "@prisma/client";
import Builder from "./_components/drag-drop/Builder";
import { getAdventurePuzzles } from "@/server/db/puzzle";

export default async function PuzzleLayout({
  params: { adventureId },
}: {
  params: { adventureId: Adventure["id"] };
}) {
  const puzzles = await getAdventurePuzzles(adventureId);

  console.log("puzzles", puzzles);

  return <Builder initialPuzzles={puzzles} adventureId={adventureId} />;
}
