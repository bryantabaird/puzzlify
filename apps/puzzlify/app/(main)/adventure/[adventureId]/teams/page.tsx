import { getAdventureIds, getAdventureStats } from "@/server/db/adventure";
import { getUserId } from "@/server/helpers/getUserId";
import HostTeamsView from "./_components/HostTeamsView";

export async function generateStaticParams() {
  const adventureIds = await getAdventureIds();
  return adventureIds.map(({ id }) => ({ adventureId: id }));
}

export default async function ViewAdventurePage({
  params,
}: {
  params: { adventureId: string };
}) {
  const userId = await getUserId();

  const adventureId = params.adventureId;
  const adventure = await getAdventureStats(adventureId);

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
