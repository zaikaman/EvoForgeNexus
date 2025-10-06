'use client';

import { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface AgentNodeData {
  label: string;
  generation: number;
  traits?: {
    creativity?: number;
    precision?: number;
    speed?: number;
    collaboration?: number;
  };
}

const initialNodes: Node<AgentNodeData>[] = [
  {
    id: 'genesis',
    type: 'default',
    position: { x: 250, y: 50 },
    data: { 
      label: 'GENESIS',
      generation: 0,
    },
    style: {
      background: '#0D0D0D',
      border: '2px solid #00FF41',
      color: '#00FF41',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '12px',
      padding: '10px',
      boxShadow: '0 0 20px rgba(0, 255, 65, 0.3)',
    },
  },
];

const initialEdges: Edge[] = [];

export function FamilyTree() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Simulate agent spawning for demo
  useEffect(() => {
    const timer = setTimeout(() => {
      // Add some demo agents
      const newNodes: Node<AgentNodeData>[] = [
        {
          id: 'ideator-1',
          position: { x: 100, y: 200 },
          data: { 
            label: 'Ideator Agent',
            generation: 1,
            traits: { creativity: 0.9, precision: 0.6 }
          },
          style: {
            background: '#0D0D0D',
            border: '1px solid #00FF41',
            color: '#00FF41',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            padding: '8px',
            boxShadow: '0 0 15px rgba(0, 255, 65, 0.2)',
          },
        },
        {
          id: 'simulator-1',
          position: { x: 250, y: 200 },
          data: { 
            label: 'Simulator Agent',
            generation: 1,
            traits: { precision: 0.95, speed: 0.7 }
          },
          style: {
            background: '#0D0D0D',
            border: '1px solid #39FF14',
            color: '#39FF14',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            padding: '8px',
            boxShadow: '0 0 15px rgba(57, 255, 20, 0.2)',
          },
        },
        {
          id: 'critic-1',
          position: { x: 400, y: 200 },
          data: { 
            label: 'Critic Agent',
            generation: 1,
            traits: { precision: 0.85, collaboration: 0.6 }
          },
          style: {
            background: '#0D0D0D',
            border: '1px solid #FFAA00',
            color: '#FFAA00',
            fontFamily: 'JetBrains Mono, monospace',
            fontSize: '10px',
            padding: '8px',
            boxShadow: '0 0 15px rgba(255, 170, 0, 0.2)',
          },
        },
      ];

      const newEdges: Edge[] = [
        {
          id: 'genesis-ideator',
          source: 'genesis',
          target: 'ideator-1',
          animated: true,
          style: { stroke: '#00FF41', strokeWidth: 1 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#00FF41' },
        },
        {
          id: 'genesis-simulator',
          source: 'genesis',
          target: 'simulator-1',
          animated: true,
          style: { stroke: '#39FF14', strokeWidth: 1 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#39FF14' },
        },
        {
          id: 'genesis-critic',
          source: 'genesis',
          target: 'critic-1',
          animated: true,
          style: { stroke: '#FFAA00', strokeWidth: 1 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#FFAA00' },
        },
      ];

      setNodes((nds) => [...nds, ...newNodes]);
      setEdges((eds) => [...eds, ...newEdges]);
    }, 2000);

    return () => clearTimeout(timer);
  }, [setNodes, setEdges]);

  return (
    <div className="h-full w-full" style={{ background: '#000' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        style={{ background: '#000' }}
      >
        <Background 
          color="#00FF41" 
          gap={20} 
          size={1}
          style={{ opacity: 0.1 }}
        />
        <Controls 
          style={{ 
            background: '#0D0D0D', 
            border: '1px solid #00FF41',
            color: '#00FF41'
          }}
        />
        <MiniMap 
          nodeColor="#00FF41"
          style={{ 
            background: '#0D0D0D',
            border: '1px solid #00FF41'
          }}
        />
      </ReactFlow>
    </div>
  );
}
