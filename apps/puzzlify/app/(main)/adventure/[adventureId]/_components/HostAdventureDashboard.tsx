import { Adventure, Stage } from "@prisma/client";
import Link from "next/link";

type Props = {
  adventure: Adventure & { stages: Stage[] };
};

const HostAdventureDashboard = ({ adventure }: Props) => {
  return (
    <>
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
    </>
  );
};

export default HostAdventureDashboard;
