"use client";

import React, { useCallback, useEffect, useState } from "react";
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
  Controls,
  OnBeforeDelete,
  OnDelete,
  OnNodesChange,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { getLayoutedElements } from "@/utils/getLayoutedElements";
import { Adventure } from "@prisma/client";
import { deleteStagesAndRelations } from "@/server/actions/host/delete-relations-and-stages";
import { useFlowConnectHandlers } from "@/hooks/useFlowConnectHandlers";
import { useRouter } from "next/navigation";
import StageList from "./HostStageList";
import { START_NODE_ID } from "@/utils/getGraphFromAdventure";

type StageNode = Node<{ label: string }>;

type ReactLayoutFlowProps = {
  initialNodes: Array<StageNode>;
  initialEdges: Array<Edge>;
  adventureId: Adventure["id"];
};

const ReactLayoutFlow = ({
  initialNodes,
  initialEdges,
  adventureId,
}: ReactLayoutFlowProps) => {
  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] =
    useNodesState<StageNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [opacity, setOpacity] = useState(0);

  const nodesInitialized = useNodesInitialized();
  const [initialLayoutFinished, setInitialLayoutFinished] = useState(false);

  const onConnectHandlers = useFlowConnectHandlers({
    adventureId,
    setNodes,
    setEdges,
    nodeCount: nodes.length,
  });

  console.log("edges render", edges);

  const onLayout = useCallback(() => {
    console.log("onLayout");
    const layouted = getLayoutedElements(nodes, edges, { rankdir: "TB" });

    const origin: [number, number] = [0, 0];

    setNodes([
      ...layouted.nodes.map((node: StageNode) => ({ ...node, origin })),
    ]);
    setEdges([...layouted.edges]);

    window.requestAnimationFrame(async () => {
      await fitView();
      if (!initialLayoutFinished) {
        setInitialLayoutFinished(true);
        setOpacity(1);
      }
    });
  }, [nodes, edges, setNodes, setEdges, fitView, initialLayoutFinished]);

  useEffect(() => {
    if (nodesInitialized && !initialLayoutFinished) {
      onLayout();
    }
  }, [nodesInitialized, initialLayoutFinished]);

  const onBeforeDelete: OnBeforeDelete<StageNode> = useCallback(
    async ({ nodes, edges }) => {
      console.log("onBeforeDelete");

      const edgeIds = edges.map((edge) => edge.id);
      const nodeIds = nodes.map((node) => node.id);

      console.log("edgeIds", edgeIds);

      await deleteStagesAndRelations(
        { adventureId },
        {
          stageRelationIds: edgeIds.filter(
            (edgeId) => !edgeId.startsWith(START_NODE_ID),
          ),
          stageIds: nodeIds.filter((nodeId) => nodeId !== START_NODE_ID),
        },
      );

      return { nodes: nodes.filter(({ id }) => id !== START_NODE_ID), edges };
    },
    [adventureId],
  );

  const router = useRouter();

  const onDelete: OnDelete = useCallback(() => {
    router.replace(`/adventure/${adventureId}/edit/stage`);
  }, [adventureId, router]);

  const handleNodesChange: OnNodesChange<StageNode> = useCallback((changes) => {
    onNodesChange(changes);
  }, []);

  return (
    <div className="w-full h-full min-h-full" style={{ opacity }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        {...onConnectHandlers}
        onBeforeDelete={onBeforeDelete}
        onDelete={onDelete}
        multiSelectionKeyCode={null}
        fitView
      >
        <Panel position="top-right">
          <button className="btn btn-primary" onClick={() => onLayout()}>
            Magic
          </button>
          <StageList adventureId={adventureId} />
        </Panel>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default ReactLayoutFlow;
