import Link from "next/link";
import { getTeamStagesInProgress } from "@/server/db/team-progress";
import { getTeamId } from "@/server/helpers/getTeamId";
import { Adventure, User } from "@prisma/client";

export default async function TeamStagesView({
  userId,
  adventureId,
}: {
  userId: User["id"];
  adventureId: Adventure["id"];
}) {
  const teamId = await getTeamId(userId, adventureId);

  const stagesInProgress = await getTeamStagesInProgress({
    teamId,
    adventureId,
  });

  if (stagesInProgress.length === 0) {
    return (
      <div>
        <h1>No stages currently in progress</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Stages in Progress</h1>
      <ul>
        {stagesInProgress.map((progress) => (
          <li key={progress.stage.id}>
            <Link
              href={`/adventure/${adventureId}/stage/${progress.stage.id}`}
              className="underline"
            >
              {progress.stage.riddle}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
