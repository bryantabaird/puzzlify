import { z } from "zod";
import { templateSchema } from "@/models/template";

export const hintSchema = z.object({
  id: z.string().uuid(),
  delay: z.number(),
  hint: z.array(templateSchema),
  stageId: z.string().uuid(),
});

export type Hint = z.infer<typeof hintSchema>;
