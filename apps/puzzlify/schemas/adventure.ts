import { z } from "zod";

export const adventureSchema = z.object({
  name: z.string().min(1, { message: "An adventure must have a name" }),
  // TODO: Consider removing the start date input to remove inital join friction
  startDate: z
    .string()
    .datetime({ message: "An adventure must have a start date" }),
});

export type Adventure = z.infer<typeof adventureSchema>;
