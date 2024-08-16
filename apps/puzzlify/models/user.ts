import email from "next-auth/providers/email";
import z from "zod";

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  dateCreated: z.string().datetime(),
  hashedPassword: z.string(),
});

export type User = z.infer<typeof userSchema>;
