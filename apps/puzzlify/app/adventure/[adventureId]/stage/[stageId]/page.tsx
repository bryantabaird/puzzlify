import { getUserId } from "@/server/helpers/getUserId";
import { isAdventureHost } from "@/server/helpers/isAdventureHost";
import { getStageWithPreviousAndNextStages } from "@/server/db/stage";
import HostStageView from "@/views/HostStageView";
import ParticipantStageView from "@/views/ParticipantStageView";
import { getUserStageStartTime } from "@/server/db/user-progress";

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

  if (isHost) {
    return <HostStageView adventureId={adventureId} stage={stage} />;
  } else {
    let startDate;
    if (stage.hints.length > 0) {
      const userProgress = await getUserStageStartTime(
        userId,
        adventureId,
        stageId,
      );
      startDate = userProgress?.startTime;
      if (!startDate) {
        throw new Error("User has not started this stage");
      }
    }

    return (
      <ParticipantStageView
        adventureId={adventureId}
        stage={stage}
        startDate={startDate}
      />
    );
  }
}
