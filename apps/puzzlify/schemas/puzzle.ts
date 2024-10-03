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

export const puzzleSchema = z.object({
  label: z.string().min(1, { message: "Puzzle name is required" }),
  riddle: z.string().min(1, { message: "Please provide a riddle" }).optional(),
  answer: z.string().min(1, { message: "Please provide an answer" }).optional(),
});

export type Puzzle = z.infer<typeof puzzleSchema>;

export const puzzlePositionSchema = z.object({
  puzzleId: z.string().min(1, "Puzzle ID is required"),
  trackId: z.string().min(1, "Track ID is required"),
  order: z.number().int().positive("Order must be greater than 0"),
});

export type PuzzlePosition = z.infer<typeof puzzlePositionSchema>;

export const puzzlePositionPayloadSchema = z.object({
  puzzlePositions: z.array(puzzlePositionSchema),
});

export type PuzzlePositionPayload = z.infer<typeof puzzlePositionPayloadSchema>;

export const hintSchema = z.object({
  hint: z.string().min(1, "Hint is required"),
  delay: z.coerce
    .number({
      required_error: "Delay value is required",
      invalid_type_error: "Delay value must be a number",
    })
    .int()
    .positive("Delay must be greater than 0")
    .min(0),
});

export type Hint = z.infer<typeof hintSchema>;
