import JoinAdventureForm from "@/components/JoinAdventureForm";
import BeginAdventureForm from "@/components/BeginAdventureForm";
import { isAdventureParticipant } from "@/server/helpers/isAdventureParticipant";
import { Adventure, User } from "@prisma/client";

type Props = {
  userId: User["id"];
  adventureId: Adventure["id"];
};

export default async function ParticipantAdventureDashboard({
  userId,
  adventureId,
}: Props) {
  const isParticipant = await isAdventureParticipant({ userId, adventureId });

  console.log("isParticipant", isParticipant);

  if (isParticipant) {
    // TODO: use the start date from adventure
    const startDate = new Date(Date.now() + 4000);

    return (
      <BeginAdventureForm adventureId={adventureId} startDate={startDate} />
    );
  } else {
    return <JoinAdventureForm adventureId={adventureId} />;
  }
}
