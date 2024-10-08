import Dagre, { GraphLabel } from "@dagrejs/dagre";
import { type Node, type Edge } from "@xyflow/react";

type PuzzleNode = Node<{ label: string }>;

export const getLayoutedElements = (
  nodes: Array<PuzzleNode>,
  edges: Array<Edge>,
  options: GraphLabel,
) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.rankdir });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    }),
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node: PuzzleNode) => {
      const position = g.node(node.id);
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};
