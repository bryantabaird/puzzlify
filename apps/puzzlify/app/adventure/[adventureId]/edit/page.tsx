import AdventureForm from "@/components/AdventureForm";
import { getAdventureLayout } from "@/server/fetchers/get-adventure-layout";
import ReactFlowLayout from "./react-flow-layout";
import { ReactFlowProvider } from "@xyflow/react";
import getGraphFromAdventure from "@/utils/getGraphFromAdventure";

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

  const { nodes: initialNodes, edges: initialEdges } =
    getGraphFromAdventure(adventure);

  return (
    <>
      <AdventureForm adventure={adventure} />
      <ReactFlowProvider>
        <ReactFlowLayout
          adventureId={adventureId}
          initialNodes={initialNodes}
          initialEdges={initialEdges}
        />
      </ReactFlowProvider>
    </>
  );
}
