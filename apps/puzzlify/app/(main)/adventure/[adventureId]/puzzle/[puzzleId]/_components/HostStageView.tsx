import HintForm from "@/components/HintForm";
import StageForm from "@/components/StageForm";
import UploadFileForm from "@/components/UploadFileForm";
import { getStageWithHints } from "@/server/db/stage";
import React from "react";
import PuzzleForm from "../../_components/PuzzlePage";

type EditStageProps = {
  adventureId: string;
  puzzleId: string;
};

export default async function EditStage({
  puzzleId,
  adventureId,
}: EditStageProps) {
  const stage = await getStageWithHints(puzzleId);

  if (!stage) {
    return (
      <div>
        <h1>Stage not found</h1>
      </div>
    );
  }

  return <PuzzleForm adventureId={adventureId} />;

  // return (
  //   <div className="flex flex-col flex-1 p-10 gap-10">
  //     <StageForm adventureId={adventureId} stage={stage} />
  //     <UploadFileForm />
  //     <HintForm adventureId={adventureId} stageId={puzzleId} />
  //     <div>
  //       {stage.hints.map((hint) => {
  //         return (
  //           <React.Fragment key={hint.id}>
  //             <HintForm
  //               adventureId={adventureId}
  //               stageId={puzzleId}
  //               hint={hint}
  //             />
  //           </React.Fragment>
  //         );
  //       })}
  //     </div>
  //   </div>
  // );
}
