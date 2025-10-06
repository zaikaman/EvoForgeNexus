'use client';

import { useState, useEffect, useRef } from 'react';
import { AgentNetwork } from '../components/AgentNetwork';
import { MetricsDashboard } from '../components/MetricsDashboard';

type TabType = 'overview' | 'network' | 'results' | 'logs';
type EvolutionStatus = 'idle' | 'running' | 'completed' | 'error';

interface Agent {
  id: string;
  name: string;
  type: string;
  generation?: number;
}

export default function Home() {
  const [mandate, setMandate] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [status, setStatus] = useState<EvolutionStatus>('idle');

  // Evolution state
  const [iteration, setIteration] = useState(0);
  const [maxIterations, setMaxIterations] = useState(5);
  const [consensus, setConsensus] = useState(0);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [phase, setPhase] = useState('idle');
  const [totalIdeas, setTotalIdeas] = useState(0);
  const [novelty, setNovelty] = useState(0);
  const [viability, setViability] = useState([0, 0, 0, 0, 0]);
  
  // Results
  const [finalResults, setFinalResults] = useState<any>(null);
  
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // WebSocket connection
  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3002');

    websocket.onopen = () => {
      addLog('✅ Connected to evolution server');
    };

    websocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    };

    websocket.onerror = (error) => {
      addLog(`❌ WebSocket error: ${error}`);
    };

    websocket.onclose = () => {
      addLog('🔌 Disconnected from server');
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const handleWebSocketMessage = (data: any) => {
    console.log('[WebSocket Event]', data.type, data);
    
    switch (data.type) {
      case 'evolution_start':
        setStatus('running');
        setIsRunning(true);
        setIteration(0);
        setFinalResults(null);
        addLog(`🚀 Evolution started: ${data.mandate}`);
        break;

      case 'iteration_start':
        setIteration(data.iteration);
        setPhase('ideation');
        addLog(`📊 Iteration ${data.iteration}/${data.maxIterations}`);
        break;

      case 'phase_change':
        setPhase(data.phase);
        addLog(`🔄 Phase: ${data.phase}`);
        break;

      case 'agent_spawned':
        const newAgent = {
          id: data.agentId,
          name: data.agentType,
          type: data.agentType,
          generation: data.generation || 0,
        };
        console.log('[Agent Spawned]', newAgent);
        setAgents(prev => {
          const updated = [...prev, newAgent];
          console.log('[Agents Updated]', updated.length, updated);
          return updated;
        });
        addLog(`🤖 Spawned ${data.agentType} (Gen ${data.generation})`);
        break;

      case 'ideas_generated':
        setTotalIdeas(prev => prev + (data.count || 0));
        if (data.avgNovelty) setNovelty(data.avgNovelty);
        addLog(`💡 Generated ${data.count} ideas (avg novelty: ${data.avgNovelty?.toFixed(2)})`);
        break;

      case 'consensus_update':
        setConsensus(data.consensus);
        addLog(`🎯 Consensus: ${(data.consensus * 100).toFixed(1)}%`);
        break;

      case 'simulation_complete':
        if (data.viabilityScores) {
          setViability(data.viabilityScores.slice(0, 5));
        }
        break;

      case 'iteration_complete':
        addLog(`✅ Iteration ${data.iteration} complete`);
        break;

      case 'evolution_complete':
        setStatus('completed');
        setIsRunning(false);
        setPhase('complete');
        setFinalResults(data.results);
        addLog(`🎉 Evolution complete! Final consensus: ${(data.results?.consensusLevel * 100).toFixed(1)}%`);
        // Auto-switch to results tab
        setActiveTab('results');
        break;

      case 'evolution_error':
        setStatus('error');
        setIsRunning(false);
        setPhase('error');
        addLog(`❌ Error: ${data.error}`);
        break;

      case 'log':
        addLog(data.message);
        break;
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const startEvolution = async () => {
    if (!mandate.trim()) {
      alert('Please enter an evolution mandate');
      return;
    }

    // Reset state
    setLogs([]);
    setAgents([{ id: 'root', name: 'Synthesis Agent', type: 'synthesis', generation: 0 }]);
    setIteration(0);
    setConsensus(0);
    setTotalIdeas(0);
    setNovelty(0);
    setViability([0, 0, 0, 0, 0]);
    setFinalResults(null);
    setStatus('running');
    setActiveTab('overview');

    try {
      const response = await fetch('http://localhost:3002/api/evolution/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mandate: {
            title: mandate,
            description: `Evolution goal: ${mandate}`,
            maxIterations: 5,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.details || 'Failed to start evolution');
      }
    } catch (error) {
      addLog(`❌ Failed to start: ${error}`);
      setStatus('error');
      setIsRunning(false);
    }
  };

  const TabButton = ({ tab, label, icon }: { tab: TabType; label: string; icon: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-6 py-3 font-mono text-sm transition-all ${
        activeTab === tab
          ? 'bg-[#00ff88] text-black shadow-[0_0_20px_rgba(0,255,136,0.5)]'
          : 'bg-black/40 text-[#00ff88] hover:bg-black/60 border border-[#00ff88]/30'
      }`}
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-black text-[#00ff88] font-mono p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 animate-pulse">
          EVOFORGE NEXUS
        </h1>
        <p className="text-[#00ff88]/60">Self-Genesis Multi-Agent Evolution System</p>
      </div>

      {/* Status Banner */}
      {status !== 'idle' && (
        <div className={`mb-6 p-4 border-2 ${
          status === 'completed' ? 'border-[#00ff88] bg-[#00ff88]/10' :
          status === 'error' ? 'border-red-500 bg-red-500/10' :
          'border-yellow-500 bg-yellow-500/10 animate-pulse'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {status === 'running' && <div className="w-3 h-3 bg-yellow-500 rounded-full animate-ping" />}
              {status === 'completed' && <div className="w-3 h-3 bg-[#00ff88] rounded-full" />}
              {status === 'error' && <div className="w-3 h-3 bg-red-500 rounded-full" />}
              <span className="text-lg font-bold">
                {status === 'running' && `ITERATION ${iteration}/${maxIterations} - PHASE: ${phase.toUpperCase()}`}
                {status === 'completed' && '✅ EVOLUTION COMPLETE - RESULTS AVAILABLE'}
                {status === 'error' && '❌ EVOLUTION FAILED - CHECK LOGS'}
              </span>
            </div>
            {status === 'completed' && (
              <button
                onClick={() => setActiveTab('results')}
                className="px-4 py-2 bg-[#00ff88] text-black font-bold hover:shadow-[0_0_20px_rgba(0,255,136,0.8)] transition-all"
              >
                VIEW RESULTS →
              </button>
            )}
          </div>
        </div>
      )}

      {/* Control Panel - Only show when idle or for new evolution */}
      {!isRunning && (
        <div className="mb-8 p-6 border-2 border-[#00ff88]/50 bg-black/50">
          <h2 className="text-xl mb-4 font-bold">EVOLUTION MANDATE</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={mandate}
              onChange={(e) => setMandate(e.target.value)}
              placeholder="Enter your evolution goal (e.g., 'Create Jarvis AI')"
              className="flex-1 bg-black border border-[#00ff88]/30 px-4 py-3 text-[#00ff88] placeholder-[#00ff88]/40 focus:border-[#00ff88] focus:outline-none"
              disabled={isRunning}
            />
            <button
              onClick={startEvolution}
              disabled={isRunning || !mandate.trim()}
              className="px-8 py-3 bg-[#00ff88] text-black font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_30px_rgba(0,255,136,0.8)] transition-all"
            >
              {isRunning ? 'RUNNING...' : 'START EVOLUTION'}
            </button>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex gap-2 mb-6">
        <TabButton tab="overview" label="OVERVIEW" icon="📊" />
        <TabButton tab="network" label="NETWORK" icon="🕸️" />
        <TabButton tab="results" label="RESULTS" icon="🎯" />
        <TabButton tab="logs" label="LOGS" icon="📝" />
      </div>

      {/* Tab Content */}
      <div className="border-2 border-[#00ff88]/50 bg-black/50 p-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <MetricsDashboard
              consensus={consensus}
              agentCount={agents.length}
              totalIdeas={totalIdeas}
              novelty={novelty}
              viability={viability}
              iteration={iteration}
              maxIterations={maxIterations}
            />
            
            {status === 'idle' && (
              <div className="text-center py-12 text-[#00ff88]/60">
                <p className="text-xl mb-2">System Ready</p>
                <p>Enter a mandate above to begin evolution</p>
              </div>
            )}
          </div>
        )}

        {/* Network Tab */}
        {activeTab === 'network' && (
          <div>
            <AgentNetwork
              agents={agents}
              phase={phase}
              iteration={iteration}
            />
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div>
            {finalResults ? (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold mb-2">EVOLUTION RESULTS</h2>
                  <div className="text-xl text-[#00ff88]/80">
                    Consensus Level: {(finalResults.consensusLevel * 100).toFixed(1)}%
                  </div>
                </div>

                {/* Top Ideas */}
                {finalResults.topIdeas && finalResults.topIdeas.length > 0 && (
                  <div className="border border-[#00ff88]/30 p-6">
                    <h3 className="text-xl font-bold mb-4">🏆 TOP IDEAS</h3>
                    <div className="space-y-4">
                      {finalResults.topIdeas.map((idea: any, idx: number) => (
                        <div key={idx} className="border-l-4 border-[#00ff88] pl-4 py-2">
                          <div className="font-bold text-lg">{idea.title || idea}</div>
                          {idea.description && (
                            <div className="text-[#00ff88]/70 mt-1">{idea.description}</div>
                          )}
                          {idea.noveltyScore !== undefined && (
                            <div className="text-sm text-[#00ff88]/50 mt-2">
                              Novelty: {(idea.noveltyScore * 100).toFixed(0)}%
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Combined Approach */}
                {finalResults.combinedApproach && (
                  <div className="border border-[#00ff88]/30 p-6">
                    <h3 className="text-xl font-bold mb-4">🎯 SYNTHESIS</h3>
                    <p className="text-[#00ff88]/80 leading-relaxed">
                      {finalResults.combinedApproach}
                    </p>
                  </div>
                )}

                {/* Agent Statistics */}
                <div className="border border-[#00ff88]/30 p-6">
                  <h3 className="text-xl font-bold mb-4">📊 STATISTICS</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-2xl font-bold">{agents.length}</div>
                      <div className="text-[#00ff88]/60">Total Agents</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{totalIdeas}</div>
                      <div className="text-[#00ff88]/60">Ideas Generated</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{iteration}</div>
                      <div className="text-[#00ff88]/60">Iterations</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{(novelty * 100).toFixed(0)}%</div>
                      <div className="text-[#00ff88]/60">Avg Novelty</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-4 justify-center pt-4">
                  <button
                    onClick={() => {
                      setStatus('idle');
                      setActiveTab('overview');
                      setMandate('');
                    }}
                    className="px-8 py-3 bg-[#00ff88] text-black font-bold hover:shadow-[0_0_30px_rgba(0,255,136,0.8)] transition-all"
                  >
                    NEW EVOLUTION
                  </button>
                  <button
                    onClick={() => {
                      const dataStr = JSON.stringify(finalResults, null, 2);
                      const dataBlob = new Blob([dataStr], { type: 'application/json' });
                      const url = URL.createObjectURL(dataBlob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `evolution-results-${Date.now()}.json`;
                      link.click();
                    }}
                    className="px-8 py-3 border-2 border-[#00ff88] text-[#00ff88] font-bold hover:bg-[#00ff88]/10 transition-all"
                  >
                    EXPORT JSON
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-[#00ff88]/60">
                <p className="text-xl mb-2">No Results Yet</p>
                <p>Complete an evolution run to see results here</p>
              </div>
            )}
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <div>
            <div className="bg-black border border-[#00ff88]/30 p-4 h-[600px] overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-[#00ff88]/60 text-center py-8">
                  System logs will appear here...
                </div>
              ) : (
                <>
                  {logs.map((log, idx) => (
                    <div key={idx} className="py-1 text-[#00ff88]/80 hover:text-[#00ff88] hover:bg-[#00ff88]/5">
                      {log}
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
