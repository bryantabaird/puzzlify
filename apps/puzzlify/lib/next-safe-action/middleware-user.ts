import { getUserId } from "@/server/helpers/getUserId";
import { createMiddleware } from "next-safe-action";

export const userMiddlewareFn = createMiddleware().define(async ({ next }) => {
  const userId = await getUserId();
  return await next({ ctx: { userId } });
});
