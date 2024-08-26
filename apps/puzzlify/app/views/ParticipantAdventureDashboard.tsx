import JoinAdventureForm from "@/components/JoinAdventureForm";
import BeginAdventureForm from "@/components/BeginAdventureForm";
import { isAdventureParticipant } from "@/server/helpers/isAdventureParticipant";
import { Adventure, User } from "@prisma/client";

type Props = {
  userId: User["id"];
  adventure: Adventure;
};

export default async function ParticipantAdventureDashboard({
  userId,
  adventure,
}: Props) {
  const hasJoinedAdventure = await isAdventureParticipant({
    userId,
    adventureId: adventure.id,
  });

  if (hasJoinedAdventure) {
    const startDate = adventure.startDate;

    return (
      <BeginAdventureForm adventureId={adventure.id} startDate={startDate} />
    );
  } else {
    return <JoinAdventureForm adventureId={adventure.id} />;
  }
}
