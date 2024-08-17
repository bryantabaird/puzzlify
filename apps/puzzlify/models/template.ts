import z from "zod";

export const templateSchema = z.union([
  z.object({
    type: z.literal("text"),
    content: z.object({ value: z.string() }),
  }),
  z.object({
    type: z.literal("video"),
    content: z.object({ value: z.string().url() }),
  }),
  z.object({
    type: z.literal("image"),
    content: z.object({ value: z.string().url() }),
  }),
  z.object({
    type: z.literal("audio"),
    content: z.object({ value: z.string().url() }),
  }),
  z.object({
    type: z.literal("html"),
    content: z.object({ value: z.string() }),
  }),
]);

export type Template = z.infer<typeof templateSchema>;
