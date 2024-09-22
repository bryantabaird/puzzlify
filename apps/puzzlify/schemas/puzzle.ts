import { z } from "zod";

export const puzzleFormSchema = z.object({
  label: z
    .string()
    .min(1, "Puzzle name is required")
    .max(30, "Puzzle name is too long"),
  riddle: z.string().min(1, "Puzzle prompt is required"),
  answer: z.string().min(1, "Puzzle answer is required"),
  assets: z.array(
    z.object({
      id: z.string(),
      fileType: z.string(),
      preview: z.string(),
    }),
  ),
  hints: z.array(
    z.object({
      hint: z.string().min(1, "Hint is required"),
      delay: z.number().min(0, "Delay must be a positive number"),
    }),
  ),
});

export type PuzzleForm = z.infer<typeof puzzleFormSchema>;
