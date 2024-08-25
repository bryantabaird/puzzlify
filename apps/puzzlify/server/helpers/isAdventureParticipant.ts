import { getParticipantAdventureId } from "../db/adventure";

type IsAdventureParticipantProps = {
  userId: string;
  adventureId: string;
};

export async function isAdventureParticipant({
  adventureId,
  userId,
}: IsAdventureParticipantProps): Promise<boolean> {
  const adventure = await getParticipantAdventureId(userId, adventureId);

  console.log("adventure", adventure);

  return !!adventure;
}
