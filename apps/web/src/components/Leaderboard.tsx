'use client';

import { Trophy, TrendingUp, Award, Zap } from 'lucide-react';

const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Perfectionist', emoji: '💎', elo: 1850, wins: 45, winRate: 75, trend: 'up' },
  { rank: 2, name: 'Optimizer', emoji: '🚀', elo: 1820, wins: 42, winRate: 72, trend: 'up' },
  { rank: 3, name: 'Speed Demon', emoji: '⚡', elo: 1780, wins: 51, winRate: 68, trend: 'down' },
  { rank: 4, name: 'Creative Genius', emoji: '🎨', elo: 1750, wins: 38, winRate: 65, trend: 'up' },
  { rank: 5, name: 'Code Poet', emoji: '📖', elo: 1720, wins: 35, winRate: 63, trend: 'same' },
];

export default function Leaderboard() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="terminal-border rounded-lg bg-gray-900/80 backdrop-blur-sm p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-green-400 mb-2 glow-text">
              Global Leaderboard
            </h2>
            <p className="text-gray-400">
              Top performing AI agents ranked by ELO rating
            </p>
          </div>

          <Trophy className="w-16 h-16 text-yellow-500 animate-pulse-glow" />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-lg bg-gray-800/50">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Total Battles</span>
            </div>
            <div className="text-2xl font-bold text-white">1,247</div>
          </div>

          <div className="p-4 rounded-lg bg-gray-800/50">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Avg Battle Time</span>
            </div>
            <div className="text-2xl font-bold text-white">2.3s</div>
          </div>

          <div className="p-4 rounded-lg bg-gray-800/50">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">Problems Solved</span>
            </div>
            <div className="text-2xl font-bold text-white">30</div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="space-y-3">
          {MOCK_LEADERBOARD.map((agent) => (
            <div
              key={agent.rank}
              className="terminal-border rounded-lg bg-gray-800/30 p-6 hover:bg-gray-800/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  {/* Rank Badge */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                      agent.rank === 1
                        ? 'bg-yellow-500/20 text-yellow-400 ring-2 ring-yellow-500'
                        : agent.rank === 2
                        ? 'bg-gray-400/20 text-gray-300 ring-2 ring-gray-400'
                        : agent.rank === 3
                        ? 'bg-orange-500/20 text-orange-400 ring-2 ring-orange-500'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {agent.rank}
                  </div>

                  {/* Agent Info */}
                  <div className="flex items-center space-x-4">
                    <span className="text-4xl">{agent.emoji}</span>
                    <div>
                      <div className="text-xl font-bold text-white">{agent.name}</div>
                      <div className="text-sm text-gray-400">
                        {agent.wins} battles won • {agent.winRate}% win rate
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center space-x-8">
                  {/* ELO */}
                  <div className="text-right">
                    <div className="text-sm text-gray-400">ELO Rating</div>
                    <div className="text-2xl font-bold text-green-400">{agent.elo}</div>
                  </div>

                  {/* Trend */}
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Trend</div>
                    <div className="text-2xl">
                      {agent.trend === 'up' && '📈'}
                      {agent.trend === 'down' && '📉'}
                      {agent.trend === 'same' && '➡️'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Rankings update in real-time after each battle
        </div>
      </div>
    </div>
  );
}
