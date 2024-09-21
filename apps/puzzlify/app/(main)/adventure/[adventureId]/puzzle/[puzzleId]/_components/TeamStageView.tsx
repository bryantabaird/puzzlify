import RiddleForm from "@/components/RiddleForm";
import { type StageWithPreviousAndNextStages } from "@/server/db/stage";
import { Hint } from "@prisma/client";
import TeamHintView from "./TeamHintView";
import { getStageAssets } from "@/server/db/asset";

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
  const assets = await getStageAssets({ stageId: stage.id });

  return (
    <>
      <RiddleForm stage={stage} adventureId={adventureId} />
      {/* TODO: Not only images */}
      {assets.map(({ id, url }) => (
        <img key={id} src={url} />
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
                  puzzleId={stage.id}
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
