import AdventureBreadCrumb from "./_components/layout/AdventureBreadCrumb";
import { getAdventureName } from "@/server/db/adventure";

export default async function AdventureLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { adventureId: string };
}) {
  const { adventureId } = params;

  const adventure = await getAdventureName(adventureId);

  if (!adventure) {
    return (
      <div>
        <h1>Adventure not found</h1>
      </div>
    );
  }

  return (
    <div>
      <AdventureBreadCrumb adventure={adventure} />
      {children}
    </div>
  );
}
