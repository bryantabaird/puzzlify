import { z } from "zod";

export const metadataSchema = z.object({
  roleName: z.literal("team").or(z.literal("host")).or(z.literal("auth")),
  actionName: z.string(),
});

export const emptySchema = z.object({});

export const adventureBindArgsSchema = z.object({
  adventureId: z.string().min(1, "Adventure ID must be at least 1 character"),
});

export const puzzleBindArgsSchema = adventureBindArgsSchema.extend({
  puzzleId: z.string().min(1, "Puzzle ID must be at least 1 character"),
});

export const puzzlesBindArgsSchema = adventureBindArgsSchema.extend({
  puzzleIds: z.array(
    z.string().min(1, "Puzzle ID must be at least 1 character"),
  ),
});

export const hintBindArgsSchema = puzzleBindArgsSchema.extend({
  hintId: z.string().min(1, "Hint ID must be at least 1 character"),
});
