import DeleteStageForm from "@/components/DeleteStageForm";
import { type Prisma, Hint, StageRelation } from "@prisma/client";
import Link from "next/link";

type StageWithLinks = Prisma.StageGetPayload<{
  include: {
    hints: true;
    previousStages: {
      include: {
        fromStage: true;
      };
    };
    nextStages: {
      include: {
        toStage: true;
      };
    };
  };
}>;

type HostStageViewProps = {
  stage: StageWithLinks;
  adventureId: string;
};

export default async function HostStageView({
  adventureId,
  stage,
}: HostStageViewProps) {
  console.log("HostStageView", stage);

  return (
    <div>
      <h1>{stage.riddle}</h1>
      <pre>{JSON.stringify(stage, null, 4)}</pre>
      <Link
        href={`/adventure/${adventureId}/stage/${stage.id}/edit`}
        className="mx-2 underline"
      >
        Edit Stage
      </Link>
      <DeleteStageForm adventureId={adventureId} stageId={stage.id} />

      <h2>Navigation</h2>
      <div className="flex">
        <div className="w-1/2">
          <h3>Previous Stages</h3>
          <ul>
            {stage.previousStages.map((relation: StageRelation) => (
              <li key={relation.fromStageId}>
                <Link
                  href={`/adventure/${adventureId}/stage/${relation.fromStageId}`}
                >
                  {relation.fromStageId}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-1/2">
          <h3>Next Stages</h3>
          <ul>
            {stage.nextStages.map((relation: StageRelation) => (
              <li key={relation.toStageId}>
                <Link
                  href={`/adventure/${adventureId}/stage/${relation.toStageId}`}
                >
                  {relation.toStageId}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h2>Hints</h2>
      <ul>
        {stage.hints.map((hint: Hint) => (
          <li key={hint.id}>
            <p>
              <strong>Hint:</strong> {hint.hint}
            </p>
            <p>
              <strong>Delay (seconds):</strong> {hint.delay}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
