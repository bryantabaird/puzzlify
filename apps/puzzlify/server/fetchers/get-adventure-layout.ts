"use server";

import { getUserId } from "../helpers/getUserId";
import { isAdventureHost } from "../helpers/isAdventureHost";
import { AdventureLayout, getAdventureLayoutDb } from "../db/adventure";

export const getAdventureLayout = async (
  adventureId: string,
): Promise<AdventureLayout> => {
  const userId = await getUserId();
  const isHost = await isAdventureHost({ adventureId, userId });

  if (!isHost) {
    throw new Error("User is not host of this adventure");
  }

  const adventure = await getAdventureLayoutDb(adventureId);

  if (!adventure) {
    throw new Error("Adventure not found");
  }

  return adventure;
};
