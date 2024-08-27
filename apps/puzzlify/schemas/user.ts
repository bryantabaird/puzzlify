import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email(),
  // TODO: Add password requirements
  password: z.string().min(1),
});
