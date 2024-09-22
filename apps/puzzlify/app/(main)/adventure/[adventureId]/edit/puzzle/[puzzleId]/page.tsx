import HintForm from "@/components/HintForm";
import PuzzleForm from "@/components/PuzzleForm";
import { getPuzzleWithHints } from "@/server/db/puzzle";
import React from "react";

type EditPuzzleProps = {
  params: {
    adventureId: string;
    puzzleId: string;
  };
};

export default async function EditPuzzle({ params }: EditPuzzleProps) {
  const { puzzleId, adventureId } = params;
  const puzzle = await getPuzzleWithHints(puzzleId);

  if (!puzzle) {
    return (
      <div>
        <h1>Puzzle not found</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 p-10 gap-10">
      <PuzzleForm adventureId={adventureId} puzzle={puzzle} />
      <HintForm adventureId={adventureId} puzzleId={params.puzzleId} />
      <div>
        {puzzle.hints.map((hint) => {
          return (
            <React.Fragment key={hint.id}>
              <HintForm
                adventureId={adventureId}
                puzzleId={puzzleId}
                hint={hint}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
