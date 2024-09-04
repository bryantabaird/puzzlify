import { AdventureTeams } from "@/server/db/adventure";

export default function HostTeamTable({
  teams,
}: {
  teams: NonNullable<AdventureTeams>;
}) {
  // TODO: empty state with a share link for friends to join
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        {/* head */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
            <th>Joined</th>
            <th>Waitlisted</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((teamData) => {
            const { team, createdAt, waitlisted } = teamData;
            return (
              <tr key={team.id}>
                <td>{team.name}</td>
                <td>{team.users.length}</td>
                <td>{createdAt.toISOString()}</td>
                <td>{waitlisted ? "Yes" : "No"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
