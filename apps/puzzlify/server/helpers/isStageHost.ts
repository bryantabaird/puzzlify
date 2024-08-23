import { getHostStageId } from "../db/stage";

type IsStageHost = {
  userId: string;
  stageId: string;
};

export async function isStageHost({
  stageId,
  userId,
}: IsStageHost): Promise<boolean> {
  const adventure = await getHostStageId(stageId, userId);

  return !!adventure;
}
