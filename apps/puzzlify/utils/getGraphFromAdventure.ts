import { AdventureLayout } from "@/server/db/adventure";
import type { Node, Edge } from "@xyflow/react";

type StageNode = Node<{ label: string }>;

const convertAdventureResponse = (
  adventure: NonNullable<AdventureLayout>,
): { nodes: StageNode[]; edges: Edge[] } => {
  const nodes: StageNode[] = [];
  const edges: Edge[] = [];

  adventure.stages.forEach((stage, idx) => {
    nodes.push({
      id: stage.id,
      data: { label: stage.label },
      position: { x: 100 * idx, y: 100 * idx },
    });

    stage.nextStages.forEach((relation) => {
      edges.push({
        id: relation.id,
        source: relation.fromStageId,
        target: relation.toStageId,
        animated: true,
      });
    });
  });

  return { nodes, edges };
};

export default convertAdventureResponse;
