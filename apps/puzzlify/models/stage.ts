import { z } from "zod";
import { hintSchema } from "@/models/hint";
import { templateSchema } from "@/models/template";

export const stageSchema = z.object({
  id: z.string().uuid(),
  riddle: z.array(templateSchema),
  hashedAnswer: z.string(),
  hints: z.array(hintSchema),
  adventureId: z.string().uuid(),
});

export type Stage = z.infer<typeof stageSchema>;
