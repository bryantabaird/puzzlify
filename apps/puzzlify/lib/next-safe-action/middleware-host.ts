import { isAdventureHost } from "@/server/helpers/isAdventureHost";
import { isHintHost } from "@/server/helpers/isHintHost";
import { isPuzzleHost } from "@/server/helpers/isPuzzleHost";
import { User } from "@prisma/client";
import { createMiddleware } from "next-safe-action";
import {
  adventureBindArgsSchema,
  hintBindArgsSchema,
  puzzleBindArgsSchema,
} from "./schemas";

export const hostAdventureMiddlewareFn = createMiddleware<{
  ctx: { userId: User["id"] };
}>().define(async ({ next, ctx, bindArgsClientInputs }) => {
  const bindArgs = bindArgsClientInputs[0];
  const { adventureId } = adventureBindArgsSchema.parse(bindArgs);
  const { userId } = ctx;

  const isHost = await isAdventureHost({ adventureId, userId });

  if (!isHost) {
    throw new Error("User is not the host of this adventure");
  }

  return await next({ ctx: { adventureId } });
});

export const hostPuzzleMiddlewareFn = createMiddleware<{
  ctx: { userId: User["id"] };
}>().define(async ({ next, ctx, bindArgsClientInputs }) => {
  const bindArgs = bindArgsClientInputs[0];
  const { puzzleId } = puzzleBindArgsSchema.parse(bindArgs);
  const { userId } = ctx;

  const isHost = await isPuzzleHost({ puzzleId, userId });

  if (!isHost) {
    throw new Error("User is not the host of this puzzle");
  }

  return await next({ ctx: { puzzleId } });
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
