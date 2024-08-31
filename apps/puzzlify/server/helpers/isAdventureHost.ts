import { getHostAdventureId } from "../db/adventure";

type IsAdventureHostProps = {
  userId: string;
  adventureId: string;
};

// TODO: Cache this frequent call that should rarely if ever change
export async function isAdventureHost({
  adventureId,
  userId,
}: IsAdventureHostProps): Promise<boolean> {
  const adventure = await getHostAdventureId({ adventureId, userId });

  return !!adventure;
}
