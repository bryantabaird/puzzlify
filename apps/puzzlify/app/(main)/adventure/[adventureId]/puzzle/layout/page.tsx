import { Adventure } from "@prisma/client";
import Builder from "./_components/drag-drop/Builder";
import { getUserId } from "@/server/helpers/getUserId";
import { isAdventureHost } from "@/server/helpers/isAdventureHost";
import { get } from "http";
import { getAdventureStages } from "@/server/db/stage";

export default async function PuzzleLayout({
  adventureId,
}: {
  adventureId: Adventure["id"];
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
