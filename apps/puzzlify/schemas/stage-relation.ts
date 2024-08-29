import { z } from "zod";

export const stageRelationSchema = z.object({
  fromStageId: z.string().min(1),
  toStageId: z.string().min(1),
});

export const deleteStageRelationsSchema = z.object({
  stageRelationIds: z.array(z.string().min(1)),
  stageIds: z.array(z.string().min(1)),
});

export type Stage = z.infer<typeof stageRelationSchema>;
