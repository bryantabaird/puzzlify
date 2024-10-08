import DeleteHintForm from "@/components/DeleteHintForm";
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
    <>
      <PuzzleForm adventureId={adventureId} puzzle={puzzle} />
      <br />
      <HintForm adventureId={adventureId} puzzleId={params.puzzleId} />
      <br />
      {puzzle.hints.map((hint) => {
        return (
          <React.Fragment key={hint.id}>
            <HintForm
              adventureId={adventureId}
              puzzleId={puzzleId}
              hint={hint}
            />
            <DeleteHintForm
              adventureId={adventureId}
              puzzleId={puzzleId}
              hintId={hint.id}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}
