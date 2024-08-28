import { type NodeProps, NodeToolbar, Position } from "@xyflow/react";

const StageNode = ({ data }: NodeProps) => {
  console.log("data", data);
  return (
    <>
      <NodeToolbar position={Position.Right}>
        <button>Add</button>
        <button>Edit</button>
        <button>Delete</button>
      </NodeToolbar>
      {/* @ts-expect-error */}
      <div className="react-flow__node-default">{data.label}</div>
    </>
  );
};

export default StageNode;
