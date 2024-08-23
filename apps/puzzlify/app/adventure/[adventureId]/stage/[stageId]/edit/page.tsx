import DeleteHintForm from "@/components/DeleteHintForm";
import HintForm from "@/components/HintForm";
import StageForm from "@/components/StageForm";
import prisma from "@/lib/prisma";
import React from "react";

type EditStageProps = {
  params: {
    adventureId: string;
    stageId: string;
  };
};

export default async function EditStage({ params }: EditStageProps) {
  const { stageId, adventureId } = params;
  const stage = await prisma.stage.findUnique({
    where: { id: stageId },
    include: {
      hints: true,
    },
  });

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
      <HintForm adventureId={adventureId} stageId={params.stageId} />
      <br />
      {stage.hints.map((hint) => {
        return (
          <React.Fragment key={hint.id}>
            <HintForm adventureId={adventureId} stageId={stageId} hint={hint} />
            <DeleteHintForm
              adventureId={adventureId}
              stageId={stageId}
              hintId={hint.id}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}
