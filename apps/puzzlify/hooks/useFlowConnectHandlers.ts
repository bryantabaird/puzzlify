import { createStage } from "@/server/actions/host/create-stage";
import { createStageRelation } from "@/server/actions/host/create-stage-relation";
import { START_NODE_ID } from "@/utils/getGraphFromAdventure";
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

type StageNode = Node<{ label: string }>;

type UseFlowConnectHandlersProps = {
  adventureId: Adventure["id"];
  setNodes: React.Dispatch<React.SetStateAction<StageNode[]>>;
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
      console.log("params", params);
      // reset the start node on connections
      connectingNodeId.current = null;

      let newEdgeId = `${params.source}-${params.target}`;
      if (params.source !== START_NODE_ID) {
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
        newEdgeId = stageRelationId;
      }

      const edge: Edge = {
        id: newEdgeId,
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
      console.log("connectingNodeId.current", connectingNodeId.current);
      if (!connectingNodeId.current) return;

      let targetIsPane = false;
      if (event.target instanceof HTMLElement) {
        targetIsPane = event.target.classList.contains("react-flow__pane");
      }

      // TODO: see if supported on touch devices
      if (targetIsPane && event instanceof MouseEvent) {
        const label = `Stage ${nodeCount + 1}`;
        const createStageResponse = await createStage(
          { adventureId },
          { label, riddle: null, answer: null },
        );
        const stageId = createStageResponse?.data?.stageId;

        if (!stageId) {
          console.error("Failed to create stage");
          return;
        }

        let newEdgeId = `${connectingNodeId.current}-${stageId}`;
        if (connectingNodeId.current !== START_NODE_ID) {
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

          newEdgeId = createStageRelationId;
        }

        const newNode: StageNode = {
          id: stageId,
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: { label },
          origin: [0.5, 0],
        };

        const newEdge = {
          id: newEdgeId,
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
