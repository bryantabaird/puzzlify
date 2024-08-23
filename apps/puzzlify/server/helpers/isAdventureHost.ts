import { getHostAdventureId } from "../db/adventure";

type IsAdventureHostProps = {
  userId: string;
  adventureId: string;
};

export async function isAdventureHost({
  adventureId,
  userId,
}: IsAdventureHostProps): Promise<boolean> {
  const adventure = await getHostAdventureId(adventureId, userId);

  return !!adventure;
}
