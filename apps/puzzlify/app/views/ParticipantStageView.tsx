// TODO: Do I need use client here?
"use client";

import RiddleForm from "@/components/RiddleForm";
import { Stage } from "@prisma/client";

type ParticipantStageProps = {
  stage: Stage;
  adventureId: string;
};

export default function ParticipateStageView({
  stage,
  adventureId,
}: ParticipantStageProps) {
  return <RiddleForm stage={stage} adventureId={adventureId} />;
}
