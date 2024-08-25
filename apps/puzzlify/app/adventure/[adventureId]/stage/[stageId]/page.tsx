import { getUserId } from "@/server/helpers/getUserId";
import { isAdventureHost } from "@/server/helpers/isAdventureHost";
import { getStageWithPreviousAndNextStages } from "@/server/db/stage";
import HostStageView from "@/app/views/HostStageView";
import ParticipantStageView from "@/app/views/ParticipantStageView";

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
    return (
      <div>
        <h1>Stage not found</h1>
      </div>
    );
  }

  if (isHost) {
    return <HostStageView adventureId={adventureId} stage={stage} />;
  } else {
    return <ParticipantStageView adventureId={adventureId} stage={stage} />;
  }
}
