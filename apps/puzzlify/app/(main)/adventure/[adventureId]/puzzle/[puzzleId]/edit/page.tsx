import DeleteHintForm from "@/components/DeleteHintForm";
import HintForm from "@/components/HintForm";
import StageForm from "@/components/StageForm";
import { getStageWithHints } from "@/server/db/stage";
import React from "react";

type EditStageProps = {
  params: {
    adventureId: string;
    puzzleId: string;
  };
};

export default async function EditStage({ params }: EditStageProps) {
  const { puzzleId, adventureId } = params;
  const stage = await getStageWithHints(puzzleId);

  if (!stage) {
    return (
      <div>
        <h1>Stage not found</h1>
      </div>
    );
  }

  return (
    <>
      <StageForm adventureId={adventureId} stage={stage} />
      <br />
      <HintForm adventureId={adventureId} stageId={params.puzzleId} />
      <br />
      {stage.hints.map((hint) => {
        return (
          <React.Fragment key={hint.id}>
            <HintForm
              adventureId={adventureId}
              stageId={puzzleId}
              hint={hint}
            />
            <DeleteHintForm
              adventureId={adventureId}
              stageId={puzzleId}
              hintId={hint.id}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}
