import { getStageIds } from "@/server/db/stage";

export async function generateStaticParams({
  params: { adventureId },
}: {
  params: { adventureId: string };
}) {
  const stageIds = await getStageIds(adventureId);
  return stageIds.map(({ id }) => ({ stageId: id, adventureId }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
