import HintForm from "@/components/HintForm";
import StageForm from "@/components/StageForm";
import UploadFileForm from "@/components/UploadFileForm";
import { getStageWithHints } from "@/server/db/stage";
import React from "react";

type EditStageProps = {
  adventureId: string;
  stageId: string;
};

export default async function EditStage({
  stageId,
  adventureId,
}: EditStageProps) {
  const stage = await getStageWithHints(stageId);

  if (!stage) {
    return (
      <div>
        <h1>Stage not found</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 p-10 gap-10">
      <StageForm adventureId={adventureId} stage={stage} />
      <UploadFileForm />
      <HintForm adventureId={adventureId} stageId={stageId} />
      <div>
        {stage.hints.map((hint) => {
          return (
            <React.Fragment key={hint.id}>
              <HintForm
                adventureId={adventureId}
                stageId={stageId}
                hint={hint}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
