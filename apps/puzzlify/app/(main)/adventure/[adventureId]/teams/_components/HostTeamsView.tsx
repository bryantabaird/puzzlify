import { getAdventureTeams } from "@/server/db/adventure";
import { Adventure, TeamAdventure } from "@prisma/client";
import HostTeamTable from "./HostTeamTable";

export default async function HostTeamsView({
  adventureId,
}: {
  adventureId: Adventure["id"];
}) {
  const teams = await getAdventureTeams(adventureId);

  if (!teams) {
    return (
      <div>
        <h1>Error retrieving adventure data</h1>
      </div>
    );
  }

  return (
    <>
      <HostTeamTable teams={teams} />
      {/* {teams.map((team: TeamAdventure) => {
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
      })} */}
    </>
  );
}
