import { getParticipantStageInProgress } from "@/server/db/user-progress";
import { getUserId } from "@/server/helpers/getUserId";
import { isAdventureHost } from "@/server/helpers/isAdventureHost";
import { isAdventureParticipant } from "@/server/helpers/isAdventureParticipant";
import { isHintHost } from "@/server/helpers/isHintHost";
import { isStageHost } from "@/server/helpers/isStageHost";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

export const baseActionClient = createSafeActionClient({
  defineMetadataSchema: () =>
    z.object({
      roleName: z
        .literal("participant")
        .or(z.literal("host"))
        .or(z.literal("auth")),
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

export const participantActionClient = userActionClient
  .bindArgsSchemas<[stageClientSchema: typeof bindArgsSchema]>([bindArgsSchema])
  .use(async ({ next, bindArgsClientInputs, ctx }) => {
    const bindArgs = bindArgsClientInputs[0];
    const { adventureId, stageId } = bindArgsSchema.parse(bindArgs);
    const { userId } = ctx;

    if (adventureId) {
      const isParticipant = isAdventureParticipant({ userId, adventureId });

      if (!isParticipant) {
        throw new Error("User is not a participant of this adventure");
      }
    }

    if (stageId && adventureId) {
      const activeStage = await getParticipantStageInProgress({
        userId,
        stageId,
        adventureId,
      });

      if (!activeStage) {
        throw new Error("This stage is not available to the user");
      }
    }

    return await next({ ctx: { userId, adventureId, stageId } });
  });
