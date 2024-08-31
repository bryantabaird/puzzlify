import { getUserId } from "@/server/helpers/getUserId";
import { isAdventureHost } from "@/server/helpers/isAdventureHost";
import { getStageWithPreviousAndNextStages } from "@/server/db/stage";
import { getTeamStageStartTime } from "@/server/db/team-progress";
import TeamStageView from "./_components/TeamStageView";
import HostStageView from "./_components/HostStageView";
import { getTeamId } from "@/server/helpers/getTeamId";

type ViewStagePageProps = {
  params: {
    stageId: string;
    adventureId: string;
  };
};

export default async function ViewStagePage({ params }: ViewStagePageProps) {
  const adventureId = params.adventureId;
  const stageId = params.stageId;

  const userId = await getUserId();

  const isHost = await isAdventureHost({ adventureId, userId });

  const stage = await getStageWithPreviousAndNextStages(stageId);

  if (!stage) {
    throw new Error("Stage not found");
  }

  const teamId = await getTeamId(userId, adventureId);

  if (isHost) {
    return <HostStageView adventureId={adventureId} stage={stage} />;
  } else {
    let startDate;
    if (stage.hints.length > 0) {
      const teamProgress = await getTeamStageStartTime({
        teamId,
        stageId,
        adventureId,
      });

      startDate = teamProgress?.startTime;
      if (!startDate) {
        throw new Error("User has not started this stage");
      }
    }

    return (
      <TeamStageView
        adventureId={adventureId}
        stage={stage}
        startDate={startDate}
      />
    );
  }
}
