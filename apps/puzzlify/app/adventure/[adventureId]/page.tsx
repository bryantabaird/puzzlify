import { getAdventureWithStages } from "@/server/db/adventure";
import HostAdventureDashboard from "@/views/HostAdventureDashboard";
import ParticipantAdventureDashboard from "@/views/ParticipantAdventureDashboard";
import { getUserId } from "@/server/helpers/getUserId";

export default async function ViewAdventurePage({
  params,
}: {
  params: { adventureId: string };
}) {
  const userId = await getUserId();

  const adventureId = params.adventureId;
  const adventure = await getAdventureWithStages(adventureId);

  if (!adventure) {
    return (
      <div>
        <h1>Adventure not found</h1>
      </div>
    );
  }

  const isHost = adventure.hostId === userId;

  if (isHost) {
    return <HostAdventureDashboard adventure={adventure} />;
  } else {
    return (
      <ParticipantAdventureDashboard userId={userId} adventure={adventure} />
    );
  }
}
