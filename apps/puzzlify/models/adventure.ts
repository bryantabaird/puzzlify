import z from "zod";
import { stageSchema } from "@/models/stage";

export const adventureSchema = z.object({
  id: z.string().uuid(),
  dateCreated: z.string().datetime(),
  name: z.string(),
  startDate: z.string().datetime(),
  stages: z.array(stageSchema),
});

export type Adventure = z.infer<typeof adventureSchema>;
