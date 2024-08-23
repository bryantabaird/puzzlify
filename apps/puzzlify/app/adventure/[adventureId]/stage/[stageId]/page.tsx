import { getUserId } from "@/server/helpers/getUserId";
import { isAdventureHost } from "@/server/helpers/isAdventureHost";
import HostStageView from "./HostView";
import ParticipantStageView from "./ParticipantView";
import prisma from "@/lib/prisma";

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

  const stage = await prisma.stage.findUnique({
    where: { id: stageId },
    include: {
      hints: true,
      previousStages: {
        include: {
          fromStage: true,
        },
      },
      nextStages: {
        include: {
          toStage: true,
        },
      },
    },
  });

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
