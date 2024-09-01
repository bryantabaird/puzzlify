import { AdventureLayout } from "@/server/db/adventure";
import type { Node, Edge } from "@xyflow/react";

type StageNode = Node<{ label: string }>;

export const START_NODE_ID = "pseudo-start";

const getStartNodes = (nodes: StageNode[], edges: Edge[]) => {
  const sourceNodeIds = new Set<string>();
  const targetNodeIds = new Set<string>();

  for (const edge of edges) {
    sourceNodeIds.add(edge.source);
    targetNodeIds.add(edge.target);
  }

  const nodeIdsWithNoEdges = nodes
    .filter(
      (node) => !sourceNodeIds.has(node.id) && !targetNodeIds.has(node.id),
    )
    .map((node) => node.id);

  const startNodeIds = new Set([
    ...Array.from(sourceNodeIds).filter((item) => !targetNodeIds.has(item)),
    ...nodeIdsWithNoEdges,
  ]);

  return nodes.filter((node) => startNodeIds.has(node.id));
};

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

  const startNodes = getStartNodes(nodes, edges);

  console.log("startNodes", startNodes);

  startNodes.forEach((node) => {
    edges.push({
      id: `${START_NODE_ID}-${node.id}`,
      source: START_NODE_ID,
      target: node.id,
      animated: true,
    });
  });

  nodes.push({
    id: START_NODE_ID,
    type: "input",
    data: { label: "Start" },
    position: { x: 0, y: 0 },
  });

  return { nodes, edges };
};

export default convertAdventureResponse;
