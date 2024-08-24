import { z } from "zod";

export const stageSchema = z.object({
  riddle: z.string().min(1),
  answer: z.string().min(1),
});

export type Stage = z.infer<typeof stageSchema>;

export const hintSchema = z.object({
  hint: z.string().min(1, "Hint is required"),
  delay: z.coerce.number().min(0, "Delay must be a non-negative number"), // Ensure delay is a number
});

export type Hint = z.infer<typeof hintSchema>;
