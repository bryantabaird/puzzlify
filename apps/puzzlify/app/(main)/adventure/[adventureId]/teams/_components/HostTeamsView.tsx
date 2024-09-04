import { getAdventureTeams } from "@/server/db/adventure";
import { Adventure, TeamAdventure } from "@prisma/client";
import HostTeamEdit from "./HostTeamEdit";

export default async function HostTeamsView({
  adventureId,
}: {
  adventureId: Adventure["id"];
}) {
  const adventureTeamData = await getAdventureTeams(adventureId);

  if (!adventureTeamData) {
    return (
      <div>
        <h1>Error retrieving adventure data</h1>
      </div>
    );
  }

  const { teams } = adventureTeamData;

  return (
    <>
      {teams.map((team: TeamAdventure) => {
        return (
          <>
            <span>{team.id}</span>
            <HostTeamEdit
              key={team.id}
              adventureId={adventureId}
              teamId={team.id}
            />
          </>
        );
      })}
    </>
  );
}
