import Link from "next/link";
import { getTeamPuzzlesInProgress } from "@/server/db/team-progress";
import { Adventure, User } from "@prisma/client";
import { getTeamUserFromAdventureUser } from "@/server/db/team-user";

export default async function TeamPuzzlesView({
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

  const puzzlesInProgress = await getTeamPuzzlesInProgress({
    teamId: teamUser.teamId,
    adventureId,
  });

  if (puzzlesInProgress.length === 0) {
    return (
      <div>
        <h1>No puzzles currently in progress</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Puzzles in Progress</h1>
      <ul>
        {puzzlesInProgress.map((progress) => (
          <li key={progress.puzzle.id}>
            <Link
              href={`/adventure/${adventureId}/puzzle/${progress.puzzle.id}`}
              className="underline"
            >
              {progress.puzzle.riddle}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
