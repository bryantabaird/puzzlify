import JoinAdventureForm from "@/components/JoinAdventureForm";
import BeginAdventureForm from "@/components/BeginAdventureForm";
import { Adventure, User } from "@prisma/client";
import { getTeamAssignment } from "@/server/db/team-assignment";

type Props = {
  userId: User["id"];
  adventure: Adventure;
};

export default async function TeamAdventureDashboard({
  userId,
  adventure,
}: Props) {
  const teamAssignment = await getTeamAssignment({
    userId,
    adventureId: adventure.id,
  });

  const isTeamInAdventure = teamAssignment !== null;

  if (isTeamInAdventure) {
    const startDate = adventure.startDate;

    return (
      <BeginAdventureForm adventureId={adventure.id} startDate={startDate} />
    );
  } else {
    return <JoinAdventureForm adventureId={adventure.id} />;
  }
}
