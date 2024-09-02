import RiddleForm from "@/components/RiddleForm";
import { type StageWithPreviousAndNextStages } from "@/server/db/stage";
import { Hint } from "@prisma/client";
import TeamHintView from "./TeamHintView";
import { getStageFileUrls } from "@/server/actions/user/get-signed-asset-retrieval-url";

type TeamStageProps = {
  stage: NonNullable<StageWithPreviousAndNextStages>;
  adventureId: string;
  startDate?: Date;
};

export default async function TeamStageView({
  stage,
  adventureId,
  startDate,
}: TeamStageProps) {
  const presignedImageUrls = await getStageFileUrls({
    adventureId,
    stageId: stage.id,
    assetIds: stage.assetIds,
  });

  return (
    <>
      <RiddleForm stage={stage} adventureId={adventureId} />
      {/* TODO: Not only images */}
      {presignedImageUrls.map(({ assetId, signedUrl }) => (
        <img key={assetId} src={signedUrl} />
      ))}
      <div>
        <h2>Hints</h2>
        <ul>
          {stage.hints.map((hint: Hint) => {
            if (!startDate) {
              throw new Error("startDate is required for a user to see hints");
            }

            return (
              <li key={hint.id}>
                <TeamHintView
                  hintId={hint.id}
                  stageId={stage.id}
                  adventureId={adventureId}
                  delay={hint.delay}
                  startDate={startDate}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
