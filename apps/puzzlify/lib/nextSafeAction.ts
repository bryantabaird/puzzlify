import { getTeamAssignment } from "@/server/db/team-assignment";
import { getTeamStageInProgress } from "@/server/db/team-progress";
import { getUserId } from "@/server/helpers/getUserId";
import { isAdventureHost } from "@/server/helpers/isAdventureHost";
import { isHintHost } from "@/server/helpers/isHintHost";
import { isStageHost } from "@/server/helpers/isStageHost";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

export const baseActionClient = createSafeActionClient({
  defineMetadataSchema: () =>
    z.object({
      roleName: z.literal("team").or(z.literal("host")).or(z.literal("auth")),
      actionName: z.string(),
    }),
});

export const userActionClient = baseActionClient.use(async ({ next }) => {
  const userId = await getUserId();
  return await next({ ctx: { userId } });
});

// TODO: zod-prisma-types
// https://github.com/TheEdoRan/next-safe-action/discussions/243
// Couldn't really find a way to "extend" bindArgsSchemas
// Opting to utilize a single object with multiple optional properties
// Sicne bindArgsSchema can't be extended, opting for a single object
// with multiple optional properties that can be added
const bindArgsSchema = z.object({
  adventureId: z.string().optional(),
  stageId: z.string().optional(),
  hintId: z.string().optional(),
});

export const hostActionClient = userActionClient
  .bindArgsSchemas<[stageClientSchema: typeof bindArgsSchema]>([bindArgsSchema])
  .use(async ({ next, bindArgsClientInputs, ctx }) => {
    const bindArgs = bindArgsClientInputs[0];
    const { adventureId, stageId, hintId } = bindArgsSchema.parse(bindArgs);
    const { userId } = ctx;

    if (adventureId) {
      const isHost = isAdventureHost({ adventureId, userId });

      if (!isHost) {
        throw new Error("User is not the host of this adventure");
      }
    }

    if (stageId) {
      const isHost = isStageHost({ stageId, userId });

      if (!isHost) {
        throw new Error("User is not the host of this stage");
      }
    }

    if (hintId) {
      const isHost = isHintHost({ hintId, userId });

      if (!isHost) {
        throw new Error("User is not the host of this hint");
      }
    }

    return await next({ ctx: { userId, adventureId, stageId } });
  });

export const teamActionClient = userActionClient
  .bindArgsSchemas<[stageClientSchema: typeof bindArgsSchema]>([bindArgsSchema])
  .use(async ({ next, bindArgsClientInputs, ctx }) => {
    const bindArgs = bindArgsClientInputs[0];
    const { adventureId, stageId } = bindArgsSchema.parse(bindArgs);
    const { userId } = ctx;

    let teamId;
    if (adventureId) {
      // TODO: I forgot an await here forever! Add linting for missing 'await' checks
      const teamAssignment = await getTeamAssignment({ userId, adventureId });

      if (!teamAssignment) {
        throw new Error("User is not on a team part of this adventure");
      }

      teamId = teamAssignment.teamId;

      if (stageId && adventureId && teamId) {
        const activeStage = await getTeamStageInProgress({
          teamId,
          stageId,
          adventureId,
        });

        if (!activeStage) {
          throw new Error("This stage is not available to the user");
        }
      }
    }

    return await next({ ctx: { userId, adventureId, stageId, teamId } });
  });
