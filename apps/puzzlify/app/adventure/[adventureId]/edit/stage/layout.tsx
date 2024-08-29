import { ReactFlowProvider } from "@xyflow/react";
import ReactFlowLayout from "../react-flow-layout";
import { getAdventureLayout } from "@/server/fetchers/get-adventure-layout";
import getGraphFromAdventure from "@/utils/getGraphFromAdventure";
import Link from "next/link";
import StageList from "../stage-list";

type LayoutProps = {
  children: React.ReactNode;
  params: { adventureId: string };
};

const Layout: React.FC<LayoutProps> = async ({ children, params }) => {
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
      <ReactFlowProvider>
        <ReactFlowLayout
          adventureId={adventureId}
          initialNodes={initialNodes}
          initialEdges={initialEdges}
        />
        <StageList adventureId={adventureId} />
      </ReactFlowProvider>
      {children}
    </>
  );
};

export default Layout;
