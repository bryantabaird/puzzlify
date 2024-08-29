import AdventureForm from "@/components/AdventureForm";
import { getAdventureLayout } from "@/server/fetchers/get-adventure-layout";

export default async function EditAdventure({
  params,
}: {
  params: { adventureId: string };
}) {
  const adventureId = params.adventureId;
  const adventure = await getAdventureLayout(adventureId);

  if (!adventure) {
    return (
      <div>
        <h1>Adventure not found</h1>
      </div>
    );
  }

  return (
    <>
      <AdventureForm adventure={adventure} />
    </>
  );
}
