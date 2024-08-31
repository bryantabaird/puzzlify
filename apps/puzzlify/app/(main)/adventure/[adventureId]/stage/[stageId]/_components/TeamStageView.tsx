import RiddleForm from "@/components/RiddleForm";
import { type StageWithPreviousAndNextStages } from "@/server/db/stage";
import { Hint } from "@prisma/client";
import TeamHintView from "./TeamHintView";

type TeamStageProps = {
  stage: NonNullable<StageWithPreviousAndNextStages>;
  adventureId: string;
  startDate?: Date;
};

export default function TeamStageView({
  stage,
  adventureId,
  startDate,
}: TeamStageProps) {
  return (
    <>
      <RiddleForm stage={stage} adventureId={adventureId} />
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
