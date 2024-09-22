import { z } from "zod";

export const puzzleRelationSchema = z.object({
  fromPuzzleId: z.string().min(1),
  toPuzzleId: z.string().min(1),
});

export const deletePuzzleRelationsSchema = z.object({
  puzzleRelationIds: z.array(z.string().min(1)),
  puzzleIds: z.array(z.string().min(1)),
});

export type Puzzle = z.infer<typeof puzzleRelationSchema>;
