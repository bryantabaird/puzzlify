"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ReactFlow,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
  useNodesInitialized,
  Background,
  addEdge,
  Controls,
  OnBeforeDelete,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { getLayoutedElements } from "@/utils/getLayoutedElements";
import { Adventure } from "@prisma/client";
import { deleteStagesAndRelations } from "@/server/actions/host/delete-relations-and-stages";
import { useFlowConnectHandlers } from "@/hooks/useFlowConnectHandlers";

type ReactLayoutFlowProps = {
  initialNodes: Array<Node>;
  initialEdges: Array<Edge>;
  adventureId: Adventure["id"];
};

const ReactLayoutFlow = ({
  initialNodes,
  initialEdges,
  adventureId,
}: ReactLayoutFlowProps) => {
  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [opacity, setOpacity] = useState(0);

  const nodesInitialized = useNodesInitialized();
  const [initialLayoutFinished, setInitialLayoutFinished] = useState(false);

  const { onConnect, onConnectEnd, onConnectStart } = useFlowConnectHandlers({
    adventureId,
    setNodes,
    setEdges,
    nodeCount: nodes.length,
  });

  const onLayout = useCallback(
    (rankdir: string) => {
      console.log("onLayout");
      const layouted = getLayoutedElements(nodes, edges, { rankdir });

      const origin: [number, number] = [0, 0];

      setNodes([...layouted.nodes.map((node: Node) => ({ ...node, origin }))]);
      setEdges([...layouted.edges]);

      window.requestAnimationFrame(async () => {
        await fitView();
        if (!initialLayoutFinished) {
          setInitialLayoutFinished(true);
          setOpacity(1);
        }
      });
    },
    [nodes, edges, setNodes, setEdges, fitView, initialLayoutFinished],
  );

  useEffect(() => {
    if (nodesInitialized && !initialLayoutFinished) {
      onLayout("TB");
    }
  }, [nodesInitialized, initialLayoutFinished]);

  const onBeforeDelete: OnBeforeDelete = useCallback(
    async ({ nodes, edges }) => {
      console.log("onBeforeDelete");

      const edgesIds = edges.map((edge) => edge.id);
      const nodesIds = nodes.map((node) => node.id);

      console.log("edgesIds", edgesIds);
      console.log("nodesIds", nodesIds);

      await deleteStagesAndRelations(
        { adventureId },
        { stageRelationIds: edgesIds, stageIds: nodesIds },
      );

      return { nodes, edges };
    },
    [],
  );

  return (
    <div style={{ width: 1000, height: 500, opacity }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        onBeforeDelete={onBeforeDelete}
        // nodeTypes={nodeTypes}
        fitView
      >
        <Panel position="top-right">
          <button onClick={() => onLayout("TB")}>vertical layout</button>
          <button onClick={() => onLayout("LR")}>horizontal layout</button>
        </Panel>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default ReactLayoutFlow;
