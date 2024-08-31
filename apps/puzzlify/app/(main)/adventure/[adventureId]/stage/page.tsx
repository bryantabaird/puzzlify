import { auth } from "@/auth";
import Link from "next/link";
import { getTeamStagesInProgress } from "@/server/db/team-progress";
import { getUserId } from "@/server/helpers/getUserId";
import { getTeamId } from "@/server/helpers/getTeamId";

type DashboardPageProps = {
  params: {
    adventureId: string;
  };
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const userId = await getUserId();
  const teamId = await getTeamId(userId, params.adventureId);

  if (!userId) {
    return (
      <div>
        <h1>You need to be logged in to view this page.</h1>
      </div>
    );
  }

  const stagesInProgress = await getTeamStagesInProgress({
    teamId,
    adventureId: params.adventureId,
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
              href={`/adventure/${params.adventureId}/stage/${progress.stage.id}`}
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
