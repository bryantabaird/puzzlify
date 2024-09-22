import PuzzlePage from "../_components/PuzzlePage";
import { getAdventureWithPuzzles } from "@/server/db/adventure";

export default async function CreatePuzzlePage({
  params,
}: {
  params: { adventureId: string };
}) {
  const adventureId = params.adventureId;
  const adventure = await getAdventureWithPuzzles(adventureId);

  if (!adventure) {
    return (
      <div>
        <h1>Adventure not found</h1>
      </div>
    );
  }

  return <PuzzlePage adventureId={adventureId} />;
}
