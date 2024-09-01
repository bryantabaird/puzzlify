import { Adventure, User } from "@prisma/client";
import { getTeamAssignment } from "../db/team-assignment";

export async function getTeam(
  userId: User["id"],
  adventureId: Adventure["id"],
) {
  const team = await getTeamAssignment({ userId, adventureId });

  if (!team) {
    throw new Error("User is not assigned to a team");
  }

  return team;
}

export async function getTeamId(
  userId: User["id"],
  adventureId: Adventure["id"],
) {
  const team = await getTeam(userId, adventureId);

  return team.teamId;
}
