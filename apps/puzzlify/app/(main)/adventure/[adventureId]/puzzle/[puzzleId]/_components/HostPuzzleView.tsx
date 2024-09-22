import { getPuzzleWithHints } from "@/server/db/puzzle";
import React from "react";
import PuzzleForm from "../../_components/PuzzlePage";

type EditPuzzleProps = {
  adventureId: string;
  puzzleId: string;
};

export default async function EditPuzzle({
  puzzleId,
  adventureId,
}: EditPuzzleProps) {
  const puzzle = await getPuzzleWithHints(puzzleId);

  if (!puzzle) {
    return (
      <div>
        <h1>Puzzle not found</h1>
      </div>
    );
  }

  return <PuzzleForm adventureId={adventureId} />;

  // return (
  //   <div className="flex flex-col flex-1 p-10 gap-10">
  //     <PuzzleForm adventureId={adventureId} puzzle={puzzle} />
  //     <UploadFileForm />
  //     <HintForm adventureId={adventureId} puzzleId={puzzleId} />
  //     <div>
  //       {puzzle.hints.map((hint) => {
  //         return (
  //           <React.Fragment key={hint.id}>
  //             <HintForm
  //               adventureId={adventureId}
  //               puzzleId={puzzleId}
  //               hint={hint}
  //             />
  //           </React.Fragment>
  //         );
  //       })}
  //     </div>
  //   </div>
  // );
}
