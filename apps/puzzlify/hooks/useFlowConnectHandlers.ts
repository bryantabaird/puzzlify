import { createStage } from "@/server/actions/host/create-stage";
import { createStageRelation } from "@/server/actions/host/create-stage-relation";
import { Adventure } from "@prisma/client";
import {
  addEdge,
  Edge,
  Node,
  OnConnect,
  OnConnectEnd,
  OnConnectStart,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useRef } from "react";

type UseFlowConnectHandlersProps = {
  adventureId: Adventure["id"];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  nodeCount: number;
};

export const useFlowConnectHandlers = ({
  adventureId,
  setEdges,
  setNodes,
  nodeCount,
}: UseFlowConnectHandlersProps) => {
  const connectingNodeId = useRef<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect: OnConnect = useCallback(
    async (params) => {
      console.log("onConnect");
      // reset the start node on connections
      connectingNodeId.current = null;

      const stageRelationResponse = await createStageRelation(
        { adventureId },
        { fromStageId: params.source, toStageId: params.target },
      );

      const stageRelationId = stageRelationResponse?.data?.stageRelationId;

      if (!stageRelationId) {
        console.error("Failed to create stage relation");
        // TODO: try catch instead?
        return;
      }

      const edge: Edge = {
        id: stageRelationId,
        source: params.source,
        target: params.target,
        animated: true,
      };

      setEdges((edges) => addEdge(edge, edges));
    },
    [setEdges, adventureId],
  );

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    console.log("onConnectStart");
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    async (event) => {
      console.log("onConnectEnd");
      if (!connectingNodeId.current) return;

      let targetIsPane = false;
      if (event.target instanceof HTMLElement) {
        targetIsPane = event.target.classList.contains("react-flow__pane");
      }

      if (targetIsPane && event instanceof MouseEvent) {
        const label = `Stage ${nodeCount}`;
        const createStageResponse = await createStage(
          { adventureId },
          { label, riddle: null, answer: null },
        );
        const stageId = createStageResponse?.data?.stageId;

        if (!stageId) {
          console.error("Failed to create stage");
          // TODO: transactional, rollback stage creation
          return;
        }

        const createStageRelationResponse = await createStageRelation(
          { adventureId },
          { fromStageId: connectingNodeId.current, toStageId: stageId },
        );

        const createStageRelationId =
          createStageRelationResponse?.data?.stageRelationId;

        if (!createStageRelationId) {
          console.error("Failed to create stage relation");
          // TODO: transactional, rollback stagerelation and stage creation
          return;
        }

        createStageRelationId;

        const newNode: Node = {
          id: stageId,
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: { label },
          origin: [0.5, 0],
        };

        const newEdge = {
          id: createStageRelationId,
          source: connectingNodeId.current,
          target: stageId,
          animated: true,
        };

        setNodes((nodes) => nodes.concat(newNode));
        setEdges((edges) => edges.concat(newEdge));
      }
    },
    [screenToFlowPosition, adventureId, setNodes, setEdges, nodeCount],
  );

  return { onConnect, onConnectStart, onConnectEnd };
};
