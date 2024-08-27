import { z } from "zod";

export const riddleSubmission = z.object({
  answer: z.string().min(1).toLowerCase(),
});

export type RiddleSubmission = z.infer<typeof riddleSubmission>;
