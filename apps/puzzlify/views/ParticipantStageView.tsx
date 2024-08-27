import RiddleForm from "@/components/RiddleForm";
import ParticipantHintView from "./ParticipantHintView";
import { type StageWithPreviousAndNextStages } from "@/server/db/stage";
import { Hint } from "@prisma/client";

type ParticipantStageProps = {
  stage: NonNullable<StageWithPreviousAndNextStages>;
  adventureId: string;
  startDate?: Date;
};

export default function ParticipateStageView({
  stage,
  adventureId,
  startDate,
}: ParticipantStageProps) {
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
                <ParticipantHintView hint={hint} startDate={startDate} />
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
