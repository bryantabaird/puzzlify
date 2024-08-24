import { getHostHintId } from "../db/hint";

type Props = {
  userId: string;
  hintId: string;
};

export async function isHintHost({ hintId, userId }: Props): Promise<boolean> {
  const hint = await getHostHintId(hintId, userId);

  return !!hint;
}
