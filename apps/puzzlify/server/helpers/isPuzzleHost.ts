import { getHostPuzzleId } from "../db/puzzle";

type IsPuzzleHost = {
  userId: string;
  puzzleId: string;
};

export async function isPuzzleHost({
  puzzleId,
  userId,
}: IsPuzzleHost): Promise<boolean> {
  const adventure = await getHostPuzzleId(puzzleId, userId);

  return !!adventure;
}
