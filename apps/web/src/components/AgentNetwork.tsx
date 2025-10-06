'use client';

import { useEffect, memo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MarkerType,
  useNodesState,
  useEdgesState,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

interface Agent {
  id: string;
  name: string;
  type: string;
  generation?: number;
}

interface AgentNetworkProps {
  agents: Array<Agent>;
  phase?: string | null;
  activeAgentId?: string;
  iteration?: number;
}

const AgentNode = memo(({ data }: any) => {
  const getColor = (type: string) => {
    const colors: Record<string, string> = {
      ideator: '#00ff88',
      simulator: '#00ffaa',
      critic: '#88ff00',
      synthesis: '#00ffcc',
    };
    return colors[type] || '#00ff88';
  };

  const getIcon = (type: string) => {
    const icons: Record<string, string> = {
      ideator: '💡',
      simulator: '🧪',
      critic: '🔍',
      synthesis: '🔗',
    };
    return icons[type] || '🤖';
  };

  const color = getColor(data.type);

  return (
    <div className="relative" style={{ filter: data.active ? `drop-shadow(0 0 20px ${color})` : 'none' }}>
      {data.active && (
        <div className="absolute inset-0 rounded-full border-2 animate-ping" style={{ borderColor: color }} />
      )}
      <div
        className="w-20 h-20 rounded-full flex flex-col items-center justify-center border-2 transition-all"
        style={{
          backgroundColor: `${color}22`,
          borderColor: color,
          color: color,
          transform: data.active ? 'scale(1.2)' : 'scale(1)',
        }}
      >
        <span className="text-3xl">{getIcon(data.type)}</span>
        {data.generation > 0 && <div className="text-[8px] font-mono opacity-60">G{data.generation}</div>}
      </div>
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono px-2 py-1 rounded whitespace-nowrap" style={{ backgroundColor: `${color}22`, color }}>
        {data.type.toUpperCase()}
      </div>
    </div>
  );
});

AgentNode.displayName = 'AgentNode';

export function AgentNetwork({ agents, phase, activeAgentId, iteration }: AgentNetworkProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (!agents.length) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const centerX = 400;
    const centerY = 300;
    const radius = 200;

    const newNodes: Node[] = agents.map((agent, index) => {
      const angle = (index / agents.length) * 2 * Math.PI - Math.PI / 2;
      const radiusOffset = (agent.generation || 0) * 60;
      return {
        id: agent.id,
        type: 'agent',
        position: {
          x: centerX + Math.cos(angle) * (radius + radiusOffset) - 40,
          y: centerY + Math.sin(angle) * (radius + radiusOffset) - 40,
        },
        data: {
          name: agent.name,
          type: agent.type,
          generation: agent.generation || 0,
          active: agent.id === activeAgentId,
        },
        draggable: false,
      };
    });

    setNodes(newNodes);

    const newEdges: Edge[] = [];
    const ideators = agents.filter(a => a.type === 'ideator');
    const simulators = agents.filter(a => a.type === 'simulator');
    const critics = agents.filter(a => a.type === 'critic');
    const synthesis = agents.find(a => a.type === 'synthesis');

    ideators.forEach(ideator => {
      simulators.forEach(simulator => {
        newEdges.push({
          id: `${ideator.id}-${simulator.id}`,
          source: ideator.id,
          target: simulator.id,
          type: 'smoothstep',
          animated: phase === 'simulation',
          style: { stroke: '#00ff88', strokeWidth: phase === 'simulation' ? 2 : 1, opacity: phase === 'simulation' ? 0.8 : 0.3 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#00ff88' },
        });
      });
    });

    simulators.forEach(simulator => {
      critics.forEach(critic => {
        newEdges.push({
          id: `${simulator.id}-${critic.id}`,
          source: simulator.id,
          target: critic.id,
          type: 'smoothstep',
          animated: phase === 'critique',
          style: { stroke: '#00ffaa', strokeWidth: phase === 'critique' ? 2 : 1, opacity: phase === 'critique' ? 0.8 : 0.3 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#00ffaa' },
        });
      });
    });

    if (synthesis) {
      critics.forEach(critic => {
        newEdges.push({
          id: `${critic.id}-${synthesis.id}`,
          source: critic.id,
          target: synthesis.id,
          type: 'smoothstep',
          animated: phase === 'synthesis',
          style: { stroke: '#88ff00', strokeWidth: phase === 'synthesis' ? 2 : 1, opacity: phase === 'synthesis' ? 0.8 : 0.3 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#88ff00' },
        });
      });

      ideators.forEach(ideator => {
        newEdges.push({
          id: `${synthesis.id}-${ideator.id}`,
          source: synthesis.id,
          target: ideator.id,
          type: 'smoothstep',
          style: { stroke: '#00ffcc', strokeWidth: 1, opacity: 0.2, strokeDasharray: '5,5' },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#00ffcc' },
        });
      });
    }

    setEdges(newEdges);
  }, [agents, activeAgentId, phase, setNodes, setEdges]);

  return (
    <div className="w-full h-[600px] bg-gradient-to-br from-gray-900 via-green-900/10 to-gray-900 rounded-lg border-2 border-[#00ff88]/30 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={{ agent: AgentNode }}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#00ff88" gap={40} size={1} style={{ opacity: 0.1 }} />
        <Controls style={{ backgroundColor: 'rgba(0, 20, 10, 0.8)', border: '1px solid #00ff88' }} />
        {phase && (
          <Panel position="top-center">
            <div className="px-6 py-3 rounded-lg backdrop-blur-md border-2 border-[#00ff88]/50" style={{ backgroundColor: 'rgba(0, 20, 10, 0.9)' }}>
              <div className="text-[#00ff88] font-mono text-sm uppercase flex items-center gap-2">
                <span className="animate-pulse">⚡</span>
                {phase} Phase
                {iteration && <span className="opacity-60 ml-2">• Iteration {iteration}</span>}
              </div>
            </div>
          </Panel>
        )}
      </ReactFlow>
    </div>
  );
}
