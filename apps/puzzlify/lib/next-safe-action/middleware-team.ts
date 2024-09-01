import { createMiddleware } from "next-safe-action";
import { stageBindArgsSchema, adventureBindArgsSchema } from "./schemas";
import { Team, User } from "@prisma/client";
import { getTeamAssignment } from "@/server/db/team-assignment";
import { getTeamStageInProgress } from "@/server/db/team-progress";

export const teamAdventureMiddlewareFn = createMiddleware<{
  ctx: { userId: User["id"] };
}>().define(async ({ next, ctx, bindArgsClientInputs }) => {
  const bindArgs = bindArgsClientInputs[0];
  const { adventureId } = adventureBindArgsSchema.parse(bindArgs);
  const { userId } = ctx;

  const teamAssignment = await getTeamAssignment({ userId, adventureId });

  if (!teamAssignment) {
    throw new Error("User is not on a team part of of this adventure");
  }

  return await next({ ctx: { adventureId, teamId: teamAssignment.teamId } });
});

export const stageAdventureMiddlewareFn = createMiddleware<{
  ctx: { userId: User["id"]; teamId: Team["id"] };
}>().define(async ({ next, ctx: { teamId }, bindArgsClientInputs }) => {
  const bindArgs = bindArgsClientInputs[0];
  const { stageId, adventureId } = stageBindArgsSchema.parse(bindArgs);

  const activeStage = await getTeamStageInProgress({
    teamId,
    stageId,
    adventureId,
  });

  if (!activeStage) {
    throw new Error("This stage is not available to the user");
  }

  return await next({ ctx: { stageId } });
});
