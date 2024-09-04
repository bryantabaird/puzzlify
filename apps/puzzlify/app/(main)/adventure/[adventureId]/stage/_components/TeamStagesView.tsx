import Link from "next/link";
import { getTeamStagesInProgress } from "@/server/db/team-progress";
import { Adventure, User } from "@prisma/client";
import { getTeamUserFromAdventureUser } from "@/server/db/team-user";

export default async function TeamStagesView({
  userId,
  adventureId,
}: {
  userId: User["id"];
  adventureId: Adventure["id"];
}) {
  const teamUser = await getTeamUserFromAdventureUser({ userId, adventureId });

  if (!teamUser) {
    throw new Error("User is not on a team that is part of this adventure");
  }

  const stagesInProgress = await getTeamStagesInProgress({
    teamId: teamUser.teamId,
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
