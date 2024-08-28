import { z } from "zod";

export const stageSchema = z.object({
  label: z.string().min(1),
  riddle: z.string().min(1).nullable(),
  answer: z.string().min(1).nullable(),
});

export type Stage = z.infer<typeof stageSchema>;

export const hintSchema = z.object({
  hint: z.string().min(1, "Hint is required"),
  delay: z.coerce.number().min(0, "Delay must be a non-negative number"),
});

export type Hint = z.infer<typeof hintSchema>;
