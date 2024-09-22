import { getUserId } from "@/server/helpers/getUserId";
import { isAdventureHost } from "@/server/helpers/isAdventureHost";
import { getPuzzleWithPreviousAndNextPuzzles } from "@/server/db/puzzle";
import { getTeamPuzzleStartTime } from "@/server/db/team-progress";
import TeamPuzzleView from "./_components/TeamPuzzleView";
import HostPuzzleView from "./_components/HostPuzzleView";
import { getTeamUserFromAdventureUser } from "@/server/db/team-user";

type ViewPuzzlePageProps = {
  params: {
    puzzleId: string;
    adventureId: string;
  };
};

export default async function ViewPuzzlePage({ params }: ViewPuzzlePageProps) {
  const adventureId = params.adventureId;
  const puzzleId = params.puzzleId;

  const userId = await getUserId();

  const isHost = await isAdventureHost({ adventureId, userId });

  const puzzle = await getPuzzleWithPreviousAndNextPuzzles(puzzleId);

  if (!puzzle) {
    throw new Error("Puzzle not found");
  }

  if (isHost) {
    return <HostPuzzleView adventureId={adventureId} puzzleId={puzzle.id} />;
  } else {
    let startDate;
    const teamUser = await getTeamUserFromAdventureUser({
      userId,
      adventureId,
    });

    if (!teamUser) {
      throw new Error("User is not on a team that is part of this adventure");
    }

    if (puzzle.hints.length > 0) {
      const teamProgress = await getTeamPuzzleStartTime({
        teamId: teamUser.teamId,
        puzzleId: puzzleId,
        adventureId,
      });

      startDate = teamProgress?.startTime;
      if (!startDate) {
        throw new Error("User has not started this puzzle");
      }
    }

    return (
      <TeamPuzzleView
        adventureId={adventureId}
        puzzle={puzzle}
        startDate={startDate}
      />
    );
  }
}
