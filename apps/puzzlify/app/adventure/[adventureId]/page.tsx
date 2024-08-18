import prisma from "@/lib/prisma";
import { Stage } from "@prisma/client";
import Link from "next/link";

export default async function ViewAdventurePage({
  params,
}: {
  params: { adventureId: string };
}) {
  const adventureId = params.adventureId;
  const adventure = await prisma.adventure.findUnique({
    where: { id: adventureId },
    include: {
      stages: true,
    },
  });

  if (!adventure) {
    return (
      <div>
        <h1>Adventure not found</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>{adventure.name}</h1>
      <pre>{JSON.stringify(adventure, null, 4)}</pre>
      <Link href={`/adventure/${adventure.id}/edit`} className="mx-2 underline">
        Edit Adventure
      </Link>
      <h2>Stages</h2>
      <ul>
        {adventure.stages.map((stage: Stage) => (
          <li key={stage.id}>
            <p>
              <strong>Riddle:</strong> {stage.riddle}
            </p>
            <p>
              <strong>Answer:</strong> {stage.answer}
            </p>
            <Link href={`/adventure/${adventure.id}/stage/${stage.id}`}>
              View Stage
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href={`/adventure/${adventure.id}/stage/create`}
        className="mx-2 underline"
      >
        Create Stage
      </Link>
    </div>
  );
}
