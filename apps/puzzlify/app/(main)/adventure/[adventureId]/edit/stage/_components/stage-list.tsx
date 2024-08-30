"use client";

import { useNodes, type Node } from "@xyflow/react";
import Link from "next/link";

type StageNode = Node<{ label: string }>;

const StageList = ({ adventureId }: { adventureId: string }) => {
  const nodes = useNodes<StageNode>();
  return (
    <ul>
      {nodes.map((node) => (
        <li key={node.id}>
          <Link
            replace
            href={`/adventure/${adventureId}/edit/stage/${node.id}`}
          >
            {node.data.label}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default StageList;
