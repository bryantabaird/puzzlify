import { NodeTypes } from "@xyflow/react";
import StageNode from "@/utils/StageNode";

const nodeTypes: NodeTypes = {
  toolbarNode: StageNode,
} as const;

export type StageNodeTypes = keyof typeof nodeTypes;

export default nodeTypes;
