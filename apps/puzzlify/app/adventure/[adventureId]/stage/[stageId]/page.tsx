import prisma from "@/lib/prisma";
import { Hint, StageRelation } from "@prisma/client";
import Link from "next/link";

type ViewStagePageProps = {
  params: {
    stageId: string;
    adventureId: string;
  };
};

export default async function ViewStagePage({ params }: ViewStagePageProps) {
  const stageId = params.stageId;
  const adventureId = params.adventureId;
  const stage = await prisma.stage.findUnique({
    where: { id: stageId },
    include: {
      hints: true,
      previousStages: {
        include: {
          fromStage: true,
        },
      },
      nextStages: {
        include: {
          toStage: true,
        },
      },
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
    <div>
      <h1>{stage.riddle}</h1>
      <pre>{JSON.stringify(stage, null, 4)}</pre>
      <Link
        href={`/adventure/${adventureId}/stage/${stageId}/edit`}
        className="mx-2 underline"
      >
        Edit Stage
      </Link>

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
