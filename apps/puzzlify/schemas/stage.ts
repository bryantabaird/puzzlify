import { z } from "zod";

export const stageSchema = z.object({
  label: z.string().min(1, { message: "Stage name is required" }),
  riddle: z.string().min(1, { message: "Please provide a riddle" }).optional(),
  answer: z.string().min(1, { message: "Please provide an answer" }).optional(),
});

export type Stage = z.infer<typeof stageSchema>;

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
