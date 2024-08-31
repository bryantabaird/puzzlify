import { getAdventureWithStages } from "@/server/db/adventure";
import ParticipantAdventureDashboard from "./_components/ParticipantAdventureDashboard";
import HostAdventureDashboard from "./_components/HostAdventureDashboard";
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

  // TODO for host:
  // If not started:
  //   Countdown
  //   Adventure layout (react flow)
  // If started:
  //   Stats per stage
  //   Leaderboard
  // Both:
  //   Upgrade options for participants
  //   Available joiners until paywall hit
  //   Possible pay to play settings for the host

  if (isHost) {
    return <HostAdventureDashboard adventure={adventure} />;
  } else {
    return (
      <ParticipantAdventureDashboard userId={userId} adventure={adventure} />
    );
  }
}
