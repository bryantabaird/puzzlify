import z from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  username: z.string(),
  dateCreated: z.string().datetime(),
  hashedPassword: z.string(),
});

export type User = z.infer<typeof userSchema>;
