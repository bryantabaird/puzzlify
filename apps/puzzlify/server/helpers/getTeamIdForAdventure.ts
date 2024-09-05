import { Adventure, User } from "@prisma/client";
import { getTeamUserFromAdventureUser } from "../db/team-user";

export async function getTeamId(
  userId: User["id"],
  adventureId: Adventure["id"],
) {
  const result = await getTeamUserFromAdventureUser({ userId, adventureId });

  if (!result) {
    throw new Error("User is not assigned to a team");
  }

  return result.teamId;
}
