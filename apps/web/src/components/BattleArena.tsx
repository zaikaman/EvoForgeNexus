'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Trophy, Clock, Zap } from 'lucide-react';
import CodeEditor from './CodeEditor';
import AgentCard from './AgentCard';
import MetricsPanel from './MetricsPanel';

interface BattleArenaProps {
  config: {
    difficulty: string;
    problemId: string;
    agents: string[];
  };
  onReturn: () => void;
}

export default function BattleArena({ config, onReturn }: BattleArenaProps) {
  const [battleState, setBattleState] = useState<'preparing' | 'running' | 'finished'>('preparing');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [agentsData, setAgentsData] = useState<any[]>([]);
  const [problem, setProblem] = useState<any>(null);
  const [battleId, setBattleId] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Load problem from backend
  useEffect(() => {
    loadProblem();
  }, [config.problemId]);

  // Initialize WebSocket
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3002');

    websocket.onopen = () => {
      console.log('[WS] Connected to battle server');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    websocket.onerror = (error) => {
      console.error('[WS] Error:', error);
    };

    websocket.onclose = () => {
      console.log('[WS] Disconnected');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const loadProblem = async () => {
    try {
      const response = await fetch(`http://localhost:3002/api/problems/${config.problemId}`);
      const data = await response.json();
      setProblem(data.problem);
    } catch (error) {
      console.error('Failed to load problem:', error);
    }
  };

  const handleWebSocketMessage = (data: any) => {
    console.log('[WS Event]', data.type, data.data);

    switch (data.type) {
      case 'battle_start':
        setBattleState('running');
        break;

      case 'agent_initialized':
        setAgentsData(prev => {
          const exists = prev.find(a => a.id === data.data.agentId);
          if (exists) return prev;
          return [...prev, {
            id: data.data.agentId,
            name: data.data.name,
            emoji: data.data.emoji,
            status: 'initialized',
            progress: 0,
            code: '',
            testsPassed: 0,
            testsTotal: 5,
            rank: prev.length + 1,
          }];
        });
        break;

      case 'agent_status':
        setAgentsData(prev => prev.map(agent =>
          agent.id === data.data.agentId
            ? { ...agent, status: data.data.status }
            : agent
        ));
        break;

      case 'code_update':
        setAgentsData(prev => prev.map(agent =>
          agent.id === data.data.agentId
            ? { ...agent, code: data.data.code, progress: data.data.progress }
            : agent
        ));
        break;

      case 'submission_complete':
        setAgentsData(prev => prev.map(agent =>
          agent.id === data.data.agentId
            ? {
                ...agent,
                status: 'submitted',
                testsPassed: data.data.testsPassed,
                testsTotal: data.data.testsTotal,
              }
            : agent
        ));
        break;

      case 'battle_complete':
        setBattleState('finished');
        // Update final rankings
        const submissions = data.data.submissions || [];
        setAgentsData(prev => prev.map(agent => {
          const submission = submissions.find((s: any) => s.agent_id === agent.id);
          return submission ? { ...agent, rank: submission.rank } : agent;
        }));
        break;

      case 'battle_error':
        console.error('[Battle Error]', data.data.error);
        setBattleState('preparing');
        break;
    }
  };

  useEffect(() => {
    if (battleState === 'running') {
      const interval = setInterval(() => {
        setTimeElapsed(t => t + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [battleState]);

  const startBattle = async () => {
    try {
      const response = await fetch('http://localhost:3002/api/battles/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemId: config.problemId,
          agentIds: config.agents,
          difficulty: config.difficulty,
        }),
      });

      const data = await response.json();
      setBattleId(data.battleId);
      console.log('[Battle Started]', data);
    } catch (error) {
      console.error('Failed to start battle:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="terminal-border rounded-lg bg-gray-900/80 backdrop-blur-sm p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onReturn}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            
            <div>
              <h2 className="text-2xl font-bold text-green-400 glow-text">
                {problem ? problem.title : 'Loading...'}
              </h2>
              <p className="text-sm text-gray-400">
                {config.difficulty.charAt(0).toUpperCase() + config.difficulty.slice(1)} • {config.agents.length} Agents
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-lg">{formatTime(timeElapsed)}</span>
            </div>

            {battleState === 'preparing' && (
              <button
                onClick={startBattle}
                className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-medium flex items-center space-x-2 transition-all transform hover:scale-105"
              >
                <Play className="w-5 h-5" />
                <span>Start Battle</span>
              </button>
            )}

            {battleState === 'running' && (
              <div className="px-6 py-3 rounded-lg bg-yellow-600 text-white font-medium flex items-center space-x-2 animate-pulse-glow">
                <Zap className="w-5 h-5" />
                <span>Battle In Progress</span>
              </div>
            )}

            {battleState === 'finished' && (
              <div className="px-6 py-3 rounded-lg bg-purple-600 text-white font-medium flex items-center space-x-2">
                <Trophy className="w-5 h-5" />
                <span>Battle Complete</span>
              </div>
            )}
          </div>
        </div>

        {/* Problem Description */}
        {problem && (
          <div className="mt-6 p-4 rounded-lg bg-gray-800/50">
            <p className="text-gray-300 leading-relaxed">{problem.description}</p>
            
            <div className="mt-4 space-y-2">
              <div className="text-sm font-medium text-gray-400">Examples:</div>
              {problem.examples.map((example: any, idx: number) => (
                <div key={idx} className="code-editor text-sm">
                  <span className="text-gray-500">Input:</span>{' '}
                  <span className="text-green-400">{JSON.stringify(example.input)}</span>
                  {' → '}
                  <span className="text-gray-500">Output:</span>{' '}
                  <span className="text-blue-400">{JSON.stringify(example.output)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Battle Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column - Agents */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-green-400">Competing Agents</h3>
          {agentsData.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>

        {/* Right Column - Live Code */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-green-400">Live Code Stream</h3>
          {agentsData.slice(0, 2).map((agent) => (
            <CodeEditor key={agent.id} agent={agent} />
          ))}
        </div>
      </div>

      {/* Metrics Panel */}
      <MetricsPanel agents={agentsData} />
    </div>
  );
}
