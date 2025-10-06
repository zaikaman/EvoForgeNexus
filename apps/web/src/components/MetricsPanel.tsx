'use client';

import { TrendingUp, Clock, Zap, Award } from 'lucide-react';

interface MetricsPanelProps {
  agents: any[];
}

export default function MetricsPanel({ agents }: MetricsPanelProps) {
  return (
    <div className="terminal-border rounded-lg bg-gray-900/80 backdrop-blur-sm p-6">
      <h3 className="text-lg font-bold text-green-400 mb-4">Live Metrics</h3>

      <div className="grid grid-cols-4 gap-4">
        {/* Average Speed */}
        <div className="p-4 rounded-lg bg-gray-800/50">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Avg Speed</span>
          </div>
          <div className="text-2xl font-bold text-white">1.2s</div>
        </div>

        {/* Tests Passed */}
        <div className="p-4 rounded-lg bg-gray-800/50">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="w-4 h-4 text-green-400" />
            <span className="text-sm text-gray-400">Tests Passed</span>
          </div>
          <div className="text-2xl font-bold text-white">
            {agents.reduce((sum, a) => sum + a.testsPassed, 0)}/{agents.length * 5}
          </div>
        </div>

        {/* Code Quality */}
        <div className="p-4 rounded-lg bg-gray-800/50">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-400">Avg Quality</span>
          </div>
          <div className="text-2xl font-bold text-white">7.5/10</div>
        </div>

        {/* Time Remaining */}
        <div className="p-4 rounded-lg bg-gray-800/50">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-gray-400">Est. Finish</span>
          </div>
          <div className="text-2xl font-bold text-white">~30s</div>
        </div>
      </div>

      {/* Leaderboard Preview */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-400 mb-3">Current Rankings</h4>
        <div className="space-y-2">
          {agents.map((agent, idx) => (
            <div
              key={agent.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30"
            >
              <div className="flex items-center space-x-3">
                <span className="font-bold text-gray-500">#{idx + 1}</span>
                <span className="text-white">{agent.name}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-green-400">{agent.testsPassed}/{agent.testsTotal}</span>
                <span className="text-gray-400">{agent.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
