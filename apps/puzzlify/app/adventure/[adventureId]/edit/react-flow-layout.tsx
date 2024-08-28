"use client";

import Dagre, { GraphLabel } from "@dagrejs/dagre";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
  OnConnectEnd,
  OnConnectStart,
  OnConnect,
  addEdge,
  Controls,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import nodeTypes from "@/utils/nodeTypes";

const getLayoutedElements = (
  nodes: Array<Node>,
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
    nodes: nodes.map((node: Node) => {
      const position = g.node(node.id);
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

type ReactLayoutFlowProps = {
  initialNodes: Array<Node>;
  initialEdges: Array<Edge>;
};

const ReactLayoutFlow = ({
  initialNodes,
  initialEdges,
}: ReactLayoutFlowProps) => {
  const { fitView } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [opacity, setOpacity] = useState(0);

  const nodesInitialized = useNodesInitialized();
  const [initialLayoutFinished, setInitialLayoutFinished] = useState(false);

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

  const connectingNodeId = useRef<string | null>(null);
  const { screenToFlowPosition } = useReactFlow();
  const onConnect: OnConnect = useCallback((params) => {
    console.log("onConnect");
    // reset the start node on connections
    connectingNodeId.current = null;
    const edge: Edge = {
      id: `${params.source}->${params.target}`,
      source: params.source,
      target: params.target,
      animated: true,
    };
    setEdges((edges) => addEdge(edge, edges));
  }, []);

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    console.log("onConnectStart");
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      console.log("onConnectEnd");
      if (!connectingNodeId.current) return;

      let targetIsPane = false;
      if (event.target instanceof HTMLElement) {
        targetIsPane = event.target.classList.contains("react-flow__pane");
      }

      if (targetIsPane && event instanceof MouseEvent) {
        const id = Math.random().toString();
        const newNode: Node = {
          id,
          position: screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
          }),
          data: { label: `Node ${id}` },
          origin: [0.5, 0],
        };

        setNodes((nodes) => nodes.concat(newNode));
        setEdges((edges) => {
          if (!connectingNodeId.current) {
            return edges;
          } else {
            const edgeId = `${connectingNodeId.current}->${id}`;
            return edges.concat({
              id: edgeId,
              source: connectingNodeId.current,
              target: id,
              animated: true,
            });
          }
        });
      }
    },
    [screenToFlowPosition],
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
