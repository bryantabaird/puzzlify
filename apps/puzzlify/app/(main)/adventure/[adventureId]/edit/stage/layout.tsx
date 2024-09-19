// TODO: remove @xyflow/react or actualy use it
import { ReactFlowProvider } from "@xyflow/react";
import ReactFlowLayout from "../../stage/_components/HostStageLayout";
import { getAdventureLayout } from "@/server/fetchers/get-adventure-layout";
import getGraphFromAdventure from "@/utils/getGraphFromAdventure";

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
    <div className="flex flex-col lg:flex-row flex-1">
      <ReactFlowProvider>
        <div className="lg:w-1/2 lg:h-full w-full h-1/2">
          <ReactFlowLayout
            adventureId={adventureId}
            initialNodes={initialNodes}
            initialEdges={initialEdges}
          />
        </div>
      </ReactFlowProvider>
      {children}
    </div>
  );
};

export default Layout;
