import JoinAdventureForm from "@/components/JoinAdventureForm";
import BeginAdventureForm from "@/components/BeginAdventureForm";
import { Adventure, User } from "@prisma/client";
import { getTeamUserFromAdventureUser } from "@/server/db/team-user";
import { getTeamAdventure } from "@/server/db/team-adventure";

type Props = {
  userId: User["id"];
  adventure: Adventure;
};

export default async function TeamAdventureDashboard({
  userId,
  adventure,
}: Props) {
  const teamUser = await getTeamUserFromAdventureUser({
    userId,
    adventureId: adventure.id,
  });

  const isTeamInAdventure = teamUser !== null;

  if (isTeamInAdventure) {
    const teamAdventure = await getTeamAdventure({
      adventureId: adventure.id,
      teamId: teamUser.teamId,
    });

    if (!teamAdventure) {
      throw new Error("Team not found for adventure");
    }

    if (teamAdventure.waitlisted) {
      // TODO: UI page with a "we notified your host to increase the team size" message
      // and a redirect to the adventure page
      return <div>Team is waitlisted</div>;
    } else {
      return (
        <BeginAdventureForm
          adventureId={adventure.id}
          startDate={adventure.startDate}
        />
      );
    }
  } else {
    return <JoinAdventureForm adventureId={adventure.id} />;
  }
}
