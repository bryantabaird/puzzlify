import { AdventureLayout } from "@/server/db/adventure";
import type { Node, Edge } from "@xyflow/react";

const convertAdventureResponse = (
  adventure: NonNullable<AdventureLayout>,
): { nodes: Node[]; edges: Edge[] } => {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  adventure.stages.forEach((stage, idx) => {
    nodes.push({
      id: stage.id,
      data: { label: stage.riddle },
      position: { x: 100 * idx, y: 100 * idx },
      // Linked to nodeTypes
      // type: "toolbarNode",
    });

    stage.nextStages.forEach((relation) => {
      edges.push({
        id: `${relation.fromStageId}->${relation.toStageId}`,
        source: relation.fromStageId,
        target: relation.toStageId,
        animated: true,
      });
    });
  });

  return { nodes, edges };
};

export default convertAdventureResponse;
