import { createSafeActionClient } from "next-safe-action";
import {
  hostAdventureMiddlewareFn,
  hostHintMiddlewareFn,
  hostPuzzleMiddlewareFn,
} from "./middleware-host";
import {
  adventureBindArgsSchema,
  baseBindArgsSchema,
  metadataSchema,
  puzzleBindArgsSchema,
} from "./schemas";
import { userMiddlewareFn } from "./middleware-user";
import {
  puzzleAdventureMiddlewareFn,
  teamAdventureMiddlewareFn,
} from "./middleware-team";

export const baseActionClient = createSafeActionClient({
  defineMetadataSchema: () => metadataSchema,
});

export const userActionClient = baseActionClient
  .bindArgsSchemas<[schema: typeof baseBindArgsSchema]>([baseBindArgsSchema])
  .use(userMiddlewareFn);

// TODO: zod-prisma-types
// https://github.com/TheEdoRan/next-safe-action/discussions/243
// Couldn't really find a way to "extend" bindArgsSchemas
// Opting to utilize a single object with multiple optional properties
// Sicne bindArgsSchema can't be extended, opting for a single object
// with multiple optional properties that can be added

export const hostAdventureActionClient = userActionClient
  .bindArgsSchemas<
    [bindArgsSchema: typeof adventureBindArgsSchema]
  >([adventureBindArgsSchema])
  .use(hostAdventureMiddlewareFn);

export const hostPuzzleActionClient = hostAdventureActionClient
  .bindArgsSchemas<
    [bindArgsSchema: typeof puzzleBindArgsSchema]
  >([puzzleBindArgsSchema])
  .use(hostPuzzleMiddlewareFn);

export const hostHintActionClient = hostPuzzleActionClient
  .bindArgsSchemas<
    [bindArgsSchema: typeof baseBindArgsSchema]
  >([baseBindArgsSchema])
  .use(hostHintMiddlewareFn);

export const teamAdventureActionClient = userActionClient
  .bindArgsSchemas<
    [bindArgsSchema: typeof adventureBindArgsSchema]
  >([adventureBindArgsSchema])
  .use(teamAdventureMiddlewareFn);

export const puzzleAdventureActionClient = teamAdventureActionClient
  .bindArgsSchemas<
    [bindArgsSchema: typeof puzzleBindArgsSchema]
  >([puzzleBindArgsSchema])
  .use(puzzleAdventureMiddlewareFn);
