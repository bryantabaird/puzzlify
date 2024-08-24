import AdventureForm from "@/components/AdventureForm";
import { getAdventureWithStages } from "@/server/db/adventure";

export default async function EditAdventure({
  params,
}: {
  params: { adventureId: string };
}) {
  const adventureId = params.adventureId;
  const adventure = await getAdventureWithStages(adventureId);

  if (!adventure) {
    return (
      <div>
        <h1>Adventure not found</h1>
      </div>
    );
  }

  return <AdventureForm adventure={adventure} />;
}
