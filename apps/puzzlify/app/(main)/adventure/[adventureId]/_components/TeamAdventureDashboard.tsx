import JoinAdventureForm from "@/components/JoinAdventureForm";
import BeginAdventureForm from "@/components/BeginAdventureForm";
import { Adventure, User } from "@prisma/client";
import { getUserAdventure } from "@/server/db/user";

type Props = {
  userId: User["id"];
  adventure: Adventure;
};

export default async function TeamAdventureDashboard({
  userId,
  adventure,
}: Props) {
  const userAdventure = await getUserAdventure({
    userId,
    adventureId: adventure.id,
  });

  const isTeamInAdventure = userAdventure !== null;

  if (isTeamInAdventure) {
    const startDate = adventure.startDate;

    return (
      <BeginAdventureForm adventureId={adventure.id} startDate={startDate} />
    );
  } else {
    return <JoinAdventureForm adventureId={adventure.id} />;
  }
}
