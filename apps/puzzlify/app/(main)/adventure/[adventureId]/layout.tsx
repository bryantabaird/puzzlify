import { getAdventureIds } from "@/server/db/adventure";

export async function generateStaticParams() {
  const adventureIds = await getAdventureIds();
  return adventureIds.map(({ id }) => ({ adventureId: id }));
}

export default function AdventureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
