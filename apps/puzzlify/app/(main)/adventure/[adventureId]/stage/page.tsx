import { getUserId } from "@/server/helpers/getUserId";
import { isAdventureHost } from "@/server/helpers/isAdventureHost";
import TeamStagesView from "./_components/TeamStagesView";

export default async function StagesPage({
  params: { adventureId },
}: {
  params: { adventureId: string };
}) {
  const userId = await getUserId();

  // TODO: This (and others) shouldn't be necessary
  if (!userId) {
    return (
      <div>
        <h1>You need to be logged in to view this page.</h1>
      </div>
    );
  }

  const isHost = await isAdventureHost({
    adventureId: adventureId,
    userId,
  });

  return isHost ? (
    // TODO: Delete
    <p>Delete me</p>
  ) : (
    <TeamStagesView adventureId={adventureId} userId={userId} />
  );
}
