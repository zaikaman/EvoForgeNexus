'use client';

import { useState, useEffect } from 'react';
import { Play, Shuffle } from 'lucide-react';

interface BattleSetupProps {
  onStartBattle: (config: any) => void;
}

const AGENTS = [
  { id: 'speed-demon', name: 'Speed Demon', emoji: '⚡', personality: 'Fast but messy' },
  { id: 'perfectionist', name: 'Perfectionist', emoji: '💎', personality: 'Slow but clean' },
  { id: 'creative-genius', name: 'Creative Genius', emoji: '🎨', personality: 'Unique approaches' },
  { id: 'optimizer', name: 'Optimizer', emoji: '🚀', personality: 'Performance-focused' },
  { id: 'code-poet', name: 'Code Poet', emoji: '📖', personality: 'Best practices' },
];

const DIFFICULTIES = ['easy', 'medium', 'hard'];

export default function BattleSetup({ onStartBattle }: BattleSetupProps) {
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [selectedProblem, setSelectedProblem] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>(['speed-demon', 'perfectionist']);
  const [problems, setProblems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Load problems from backend
  useEffect(() => {
    loadProblems();
  }, [difficulty]);

  const loadProblems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3002/api/problems?difficulty=${difficulty}`);
      const data = await response.json();
      const problemList = data.problems || data[difficulty] || [];
      setProblems(problemList);
      if (problemList.length > 0 && !selectedProblem) {
        setSelectedProblem(problemList[0].id);
      }
    } catch (error) {
      console.error('Failed to load problems:', error);
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAgent = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      if (selectedAgents.length > 2) {
        setSelectedAgents(selectedAgents.filter(id => id !== agentId));
      }
    } else {
      if (selectedAgents.length < 5) {
        setSelectedAgents([...selectedAgents, agentId]);
      }
    }
  };

  const randomizeBattle = () => {
    const randomDiff = DIFFICULTIES[Math.floor(Math.random() * DIFFICULTIES.length)] as 'easy' | 'medium' | 'hard';
    const randomAgentCount = 2 + Math.floor(Math.random() * 3); // 2-4 agents
    const shuffled = [...AGENTS].sort(() => 0.5 - Math.random());
    const randomAgents = shuffled.slice(0, randomAgentCount).map(a => a.id);
    
    setDifficulty(randomDiff);
    setSelectedAgents(randomAgents);
  };

  const handleStart = () => {
    onStartBattle({
      difficulty,
      problemId: selectedProblem,
      agents: selectedAgents,
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="terminal-border rounded-lg bg-gray-900/80 backdrop-blur-sm p-8">
        <h2 className="text-3xl font-bold text-green-400 mb-2 glow-text">
          Setup Battle Arena
        </h2>
        <p className="text-gray-400 mb-8">
          Choose problem difficulty and select AI agents to compete
        </p>

        {/* Difficulty Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-green-400 mb-3">
            Problem Difficulty
          </label>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  difficulty === diff
                    ? 'bg-green-600 text-white ring-2 ring-green-400'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {diff.charAt(0).toUpperCase() + diff.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Problem Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-green-400 mb-3">
            Select Problem {loading && '(Loading...)'}
          </label>
          <select
            value={selectedProblem}
            onChange={(e) => setSelectedProblem(e.target.value)}
            disabled={loading || problems.length === 0}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none disabled:opacity-50"
          >
            {problems.length === 0 && (
              <option value="">No problems available</option>
            )}
            {problems.map((problem) => (
              <option key={problem.id} value={problem.id}>
                {problem.title}
              </option>
            ))}
          </select>
        </div>

        {/* Agent Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-green-400">
              Select Agents (2-5)
            </label>
            <button
              onClick={randomizeBattle}
              className="flex items-center space-x-2 text-sm text-gray-400 hover:text-green-400 transition-colors"
            >
              <Shuffle className="w-4 h-4" />
              <span>Randomize</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AGENTS.map((agent) => (
              <button
                key={agent.id}
                onClick={() => toggleAgent(agent.id)}
                className={`p-4 rounded-lg text-left transition-all ${
                  selectedAgents.includes(agent.id)
                    ? 'bg-green-600/20 border-2 border-green-500 ring-2 ring-green-400/30'
                    : 'bg-gray-800 border-2 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{agent.emoji}</span>
                  <div className="flex-1">
                    <div className="font-medium text-white">{agent.name}</div>
                    <div className="text-sm text-gray-400">{agent.personality}</div>
                  </div>
                  {selectedAgents.includes(agent.id) && (
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  )}
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-3 text-sm text-gray-500">
            {selectedAgents.length} agent{selectedAgents.length !== 1 ? 's' : ''} selected
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={selectedAgents.length < 2}
          className="w-full py-4 rounded-lg font-bold text-lg flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <Play className="w-6 h-6" />
          <span>START BATTLE</span>
        </button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="terminal-border rounded-lg bg-gray-900/50 p-4 text-center">
          <div className="text-3xl font-bold text-green-400">30</div>
          <div className="text-sm text-gray-400">Problems</div>
        </div>
        <div className="terminal-border rounded-lg bg-gray-900/50 p-4 text-center">
          <div className="text-3xl font-bold text-green-400">5</div>
          <div className="text-sm text-gray-400">AI Agents</div>
        </div>
        <div className="terminal-border rounded-lg bg-gray-900/50 p-4 text-center">
          <div className="text-3xl font-bold text-green-400">∞</div>
          <div className="text-sm text-gray-400">Possibilities</div>
        </div>
      </div>
    </div>
  );
}
