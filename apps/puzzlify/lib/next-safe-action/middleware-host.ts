import { getHostAdventureId } from "@/server/db/adventure";
import { isHintHost } from "@/server/helpers/isHintHost";
import { User } from "@prisma/client";
import { createMiddleware } from "next-safe-action";
import {
  hintBindArgsSchema,
  puzzleBindArgsSchema,
  puzzlesBindArgsSchema,
  adventureBindArgsSchema,
} from "./schemas";
import { getHostPuzzleId, getHostPuzzleIds } from "@/server/db/puzzle";

export const hostAdventureMiddlewareFn = createMiddleware<{
  ctx: { userId: User["id"] };
}>().define(async ({ next, ctx: { userId }, bindArgsClientInputs }) => {
  const bindArgs = bindArgsClientInputs[0];
  const { adventureId } = adventureBindArgsSchema.parse(bindArgs);

  const hostAdventureId = await getHostAdventureId({ adventureId, userId });

  if (!hostAdventureId) {
    throw new Error("User is not the host of this adventure");
  }

  return await next({ ctx: { hostAdventureId } });
});

export const hostPuzzlesMiddlewareFn = createMiddleware<{
  ctx: { userId: User["id"] };
}>().define(async ({ next, ctx: { userId }, bindArgsClientInputs }) => {
  const bindArgs = bindArgsClientInputs[0];
  const { puzzleIds } = puzzlesBindArgsSchema.parse(bindArgs);

  const hostPuzzleIds = await getHostPuzzleIds({ puzzleIds, userId });

  return await next({ ctx: { hostPuzzleIds } });
});

export const hostPuzzleMiddlewareFn = createMiddleware<{
  ctx: { userId: User["id"] };
}>().define(async ({ next, ctx: { userId }, bindArgsClientInputs }) => {
  const bindArgs = bindArgsClientInputs[0];
  const { puzzleId } = puzzleBindArgsSchema.parse(bindArgs);

  const hostPuzzleId = await getHostPuzzleId({ puzzleId, userId });

  return await next({ ctx: { hostPuzzleId } });
});

export const hostHintMiddlewareFn = createMiddleware<{
  ctx: { userId: User["id"] };
}>().define(async ({ next, ctx, bindArgsClientInputs }) => {
  const bindArgs = bindArgsClientInputs[0];
  const { hintId } = hintBindArgsSchema.parse(bindArgs);
  const { userId } = ctx;

  const isHost = await isHintHost({ hintId, userId });

  if (!isHost) {
    throw new Error("User is not the host of this hint");
  }

  return await next({ ctx: { hintId } });
});
