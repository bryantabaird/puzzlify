import { z } from "zod";

export const assetSchema = z.object({
  url: z.string().min(1, { message: "URL is required" }),
  id: z.string().uuid({ message: "Invalid asset ID" }),
});
