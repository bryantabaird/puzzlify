import { z } from "zod";

export const adventureSchema = z.object({
  name: z.string().min(1),
  startDate: z.string().datetime(),
});

export type Adventure = z.infer<typeof adventureSchema>;
