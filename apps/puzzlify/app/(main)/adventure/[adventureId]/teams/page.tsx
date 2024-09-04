import { getFullAdventure } from "@/server/db/adventure";
import { getUserId } from "@/server/helpers/getUserId";
import HostTeamsView from "./_components/HostTeamsView";

export default async function ViewAdventurePage({
  params,
}: {
  params: { adventureId: string };
}) {
  const userId = await getUserId();

  const adventureId = params.adventureId;
  const adventure = await getFullAdventure(adventureId);

  if (!adventure) {
    return (
      <div>
        <h1>Adventure not found</h1>
      </div>
    );
  }

  const isHost = adventure.hostId === userId;

  if (isHost) {
    return <HostTeamsView adventureId={adventure.id} />;
  } else {
    return <div>Only hosts can view teams</div>;
  }
}
