'use client';

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    status: string;
    progress: number;
    testsPassed: number;
    testsTotal: number;
    rank: number;
  };
}

const AGENT_EMOJIS: Record<string, string> = {
  'speed-demon': '⚡',
  'perfectionist': '💎',
  'creative-genius': '🎨',
  'optimizer': '🚀',
  'code-poet': '📖',
};

const STATUS_COLORS: Record<string, string> = {
  thinking: 'text-yellow-400',
  coding: 'text-blue-400',
  testing: 'text-purple-400',
  submitted: 'text-green-400',
  failed: 'text-red-400',
};

export default function AgentCard({ agent }: AgentCardProps) {
  const emoji = AGENT_EMOJIS[agent.id] || '🤖';
  const statusColor = STATUS_COLORS[agent.status] || 'text-gray-400';

  return (
    <div className="terminal-border rounded-lg bg-gray-900/50 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">{emoji}</span>
          <div>
            <div className="font-medium text-white">{agent.name}</div>
            <div className={`text-sm ${statusColor}`}>
              {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-green-400">#{agent.rank}</div>
          <div className="text-xs text-gray-500">Rank</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{agent.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-600 to-emerald-500 transition-all duration-500"
            style={{ width: `${agent.progress}%` }}
          />
        </div>
      </div>

      {/* Tests Passed */}
      <div className="flex justify-between text-sm">
        <span className="text-gray-400">Tests Passed</span>
        <span className="font-mono text-green-400">
          {agent.testsPassed}/{agent.testsTotal}
        </span>
      </div>
    </div>
  );
}
