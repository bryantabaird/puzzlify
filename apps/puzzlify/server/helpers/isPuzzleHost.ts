import { getHostPuzzleIds } from "../db/puzzle";

type IsPuzzleHost = {
  userId: string;
  puzzleId: string;
};

export async function isPuzzleHost({
  puzzleId,
  userId,
}: IsPuzzleHost): Promise<boolean> {
  const hostPuzzleIds = await getHostPuzzleIds({
    puzzleIds: [puzzleId],
    userId,
  });

  return hostPuzzleIds[0] === puzzleId;
}
