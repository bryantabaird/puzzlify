import { z } from "zod";

export const metadataSchema = z.object({
  roleName: z.literal("team").or(z.literal("host")).or(z.literal("auth")),
  actionName: z.string(),
});

export const baseBindArgsSchema = z.object({
  adventureId: z.string().optional(),
  stageId: z.string().optional(),
  hintId: z.string().optional(),
  teamId: z.string().optional(),
});

export const adventureBindArgsSchema = baseBindArgsSchema.extend({
  adventureId: z.string().min(1, "Adventure ID must be at least 1 character"),
});

export const teamBindArgsSchema = adventureBindArgsSchema.extend({
  teamId: z.string().min(1, "Team ID must be at least 1 character"),
});

export const stageBindArgsSchema = adventureBindArgsSchema.extend({
  stageId: z.string().min(1, "Stage ID must be at least 1 character"),
});

export const hintBindArgsSchema = stageBindArgsSchema.extend({
  hintId: z.string().min(1, "Hint ID must be at least 1 character"),
});
