import { createMiddleware } from "next-safe-action";
import { puzzleBindArgsSchema, adventureBindArgsSchema } from "./schemas";
import { Team, User } from "@prisma/client";
import { getTeamUserFromAdventureUser } from "@/server/db/team-user";
import { getTeamPuzzleInProgress } from "@/server/db/team-progress";

export const teamAdventureMiddlewareFn = createMiddleware<{
  ctx: { userId: User["id"] };
}>().define(async ({ next, ctx, bindArgsClientInputs }) => {
  const bindArgs = bindArgsClientInputs[0];
  const { adventureId } = adventureBindArgsSchema.parse(bindArgs);
  const { userId } = ctx;

  // Ensure the user is on a team and part of the adventure
  const teamUser = await getTeamUserFromAdventureUser({ userId, adventureId });

  if (!teamUser) {
    throw new Error("User is not on a team or part of this adventure");
  }

  return await next({ ctx: { adventureId, teamId: teamUser.teamId } });
});

export const puzzleAdventureMiddlewareFn = createMiddleware<{
  ctx: { userId: User["id"]; teamId: Team["id"] };
}>().define(async ({ next, ctx: { teamId }, bindArgsClientInputs }) => {
  const bindArgs = bindArgsClientInputs[0];
  const { puzzleId, adventureId } = puzzleBindArgsSchema.parse(bindArgs);

  const activePuzzle = await getTeamPuzzleInProgress({
    teamId,
    puzzleId,
    adventureId,
  });

  if (!activePuzzle) {
    throw new Error("This puzzle is not available to the user");
  }

  return await next({ ctx: { puzzleId } });
});
