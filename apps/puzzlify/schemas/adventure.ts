import { z } from "zod";

export const joinAdventureSchema = z.object({
  teamName: z
    .string()
    .min(3, { message: "Team name must be at least 3 characters long" })
    .max(30, { message: "Team name must be at most 30 characters long" })
    .regex(/^[A-Za-z0-9\s-_]+$/, {
      message:
        "Team name can only contain letters, numbers, spaces, hyphens, and underscores",
    }),
});

// TODO: Phase 2, consider a sophisticated schema for multiple users per team
export type JoinAdventure = z.infer<typeof joinAdventureSchema>;

export const adventureSchema = z.object({
  name: z.string().min(1, { message: "An adventure must have a name" }),
  // TODO: Consider removing the start date input to remove inital join friction
  startDate: z
    .string()
    .datetime({ message: "An adventure must have a start date" }),
});

export type Adventure = z.infer<typeof adventureSchema>;
