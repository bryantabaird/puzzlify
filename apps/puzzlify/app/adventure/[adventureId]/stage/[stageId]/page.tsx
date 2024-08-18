import prisma from "@/lib/prisma";
import { Hint } from "@prisma/client";
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
    },
  });

  if (!stage) {
    return (
      <div>
        <h1>Adventure not found</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>{stageId}</h1>
      <pre>{JSON.stringify(stage, null, 4)}</pre>
      <Link
        href={`/adventure/${adventureId}/stage/${stageId}/edit`}
        className="mx-2 underline"
      >
        Edit Stage
      </Link>
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
            <Link
              href={`/adventure/${adventureId}/stage/${stageId}/hint/${hint.id}`}
            >
              View Hint
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={`/adventure/${stageId}/stage/${stageId}/hint/create`}
        className="mx-2 underline"
      >
        Create Hint
      </Link>
    </div>
  );
}
