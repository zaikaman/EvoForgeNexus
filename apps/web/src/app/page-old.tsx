'use client';

import { useState, useEffect } from 'react';
import { Terminal, Dna, Activity, Zap } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';
import { FamilyTree } from '../components/FamilyTree';
import { AgentNetwork } from '../components/AgentNetwork';
import { MetricsDashboard } from '../components/MetricsDashboard';

export default function Home() {
  const [isActive, setIsActive] = useState(false);
  const [evolutionLog, setEvolutionLog] = useState<string[]>([
    '> System initialized',
    '> Awaiting evolution mandate...',
  ]);
  
  // Evolution state
  const [currentIteration, setCurrentIteration] = useState(0);
  const [maxIterations, setMaxIterations] = useState(8);
  const [consensus, setConsensus] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'ideation' | 'simulation' | 'critique' | 'synthesis' | null>(null);
  const [agents, setAgents] = useState<Array<{ id: string; name: string; type: string; generation?: number }>>([
    { id: 'ideator-1', name: 'Ideator Agent', type: 'ideator', generation: 0 },
    { id: 'simulator-1', name: 'Simulator Agent', type: 'simulator', generation: 0 },
    { id: 'critic-1', name: 'Critic Agent', type: 'critic', generation: 0 },
    { id: 'synthesis-1', name: 'Synthesis Agent', type: 'synthesis', generation: 0 },
  ]);
  const [totalIdeas, setTotalIdeas] = useState(0);
  const [avgNovelty, setAvgNovelty] = useState(0);
  const [avgViability, setAvgViability] = useState(0);
  const [activeAgentId, setActiveAgentId] = useState<string | undefined>();
  
  // Connect to WebSocket
  const { isConnected, events, latency, subscribe } = useWebSocket('ws://localhost:3002');

  // Handle evolution events
  useEffect(() => {
    if (events.length === 0) return;
    
    const latestEvent = events[events.length - 1];
    const timestamp = new Date(latestEvent.timestamp).toLocaleTimeString();
    
    switch (latestEvent.type) {
      case 'connection':
        setEvolutionLog((prev) => [...prev, `[${timestamp}] ${latestEvent.message}`]);
        break;
      case 'evolution_started':
        setEvolutionLog((prev) => [...prev, `[${timestamp}] 🚀 Evolution started: ${latestEvent.mandate}`]);
        setIsActive(true);
        setCurrentIteration(0);
        setTotalIdeas(0);
        break;
      case 'iteration_started':
        setEvolutionLog((prev) => [...prev, `[${timestamp}] 📍 Iteration ${latestEvent.iteration} started`]);
        setCurrentIteration(latestEvent.iteration);
        break;
      case 'phase_started':
        const phaseEmoji: Record<string, string> = {
          ideation: '💡',
          simulation: '🧪',
          critique: '🔍',
          synthesis: '🔗'
        };
        const emoji = phaseEmoji[latestEvent.phase] || '⚙️';
        setEvolutionLog((prev) => [...prev, `[${timestamp}] ${emoji} ${latestEvent.phase.toUpperCase()} phase started...`]);
        setCurrentPhase(latestEvent.phase);
        break;
      case 'phase_completed':
        setEvolutionLog((prev) => [...prev, `[${timestamp}] ✅ ${latestEvent.phase.toUpperCase()}: ${latestEvent.count} items completed`]);
        if (latestEvent.phase === 'ideation') {
          setTotalIdeas(prev => prev + latestEvent.count);
        }
        break;
      case 'consensus_update':
        setEvolutionLog((prev) => [...prev, `[${timestamp}] 📊 Consensus: ${(latestEvent.consensus * 100).toFixed(0)}%`]);
        setConsensus(latestEvent.consensus);
        if (latestEvent.avgNovelty) setAvgNovelty(latestEvent.avgNovelty);
        if (latestEvent.avgViability) setAvgViability(latestEvent.avgViability);
        break;
      case 'agent_spawned':
        setEvolutionLog((prev) => [...prev, `[${timestamp}] ✨ Agent spawned: ${latestEvent.agent.name}`]);
        setAgents(prev => [...prev, {
          id: latestEvent.agent.id,
          name: latestEvent.agent.name,
          type: latestEvent.agent.type || 'ideator',
          generation: latestEvent.agent.generation || 1,
        }]);
        break;
      case 'iteration_complete':
        setEvolutionLog((prev) => [...prev, `[${timestamp}] ⚡ Iteration ${latestEvent.iteration} complete`]);
        setCurrentPhase(null);
        break;
      case 'evolution_completed':
        setEvolutionLog((prev) => [...prev, `[${timestamp}] ✅ Evolution completed after ${latestEvent.iterations} iterations`]);
        setIsActive(false);
        setCurrentPhase(null);
        break;
      default:
        console.log('Unknown event type:', latestEvent.type);
    }
  }, [events]);

  const startEvolution = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const mandate = {
      title: formData.get('title'),
      domain: formData.get('domain'),
      maxIterations: parseInt(formData.get('maxIterations') as string),
      maxAgents: parseInt(formData.get('maxAgents') as string),
    };

    try {
      const response = await fetch('http://localhost:3002/api/evolution/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mandate }),
      });
      
      const result = await response.json();
      
      if (result.success) {
        subscribe(result.evolutionId);
        setEvolutionLog((prev) => [...prev, `> Evolution ID: ${result.evolutionId}`]);
      }
    } catch (error) {
      console.error('Failed to start evolution:', error);
      setEvolutionLog((prev) => [...prev, '❌ Failed to start evolution']);
    }
  };

  return (
    <main className="min-h-screen p-6">
      {/* Header */}
      <header className="mb-6 pb-4 border-b-2 border-matrix-green">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl terminal-text">EVOFORGE NEXUS</h1>
            <p className="text-xs text-matrix-green/60 mt-1">Self-Genesis Multi-Agent Ecosystem v0.1.0</p>
          </div>
          
          <div className="flex items-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-matrix-green animate-glow-pulse' : 'bg-matrix-green/30'}`} />
              <span>{isActive ? 'ACTIVE' : 'STANDBY'}</span>
            </div>
            <div>AGENTS: <span className="terminal-text">004</span></div>
            <div>GEN: <span className="terminal-text">001</span></div>
          </div>
        </div>
      </header>

      {/* Main Grid - 2 Rows */}
      <div className="space-y-4">
        {/* Top Row - Agent Network Visualization */}
        <div className="grid grid-cols-12 gap-4">
          {/* Agent Network */}
          <div className="col-span-9">
            <section className="agent-card">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-matrix-green/30">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  <h2 className="text-sm font-display">AGENT NETWORK</h2>
                </div>
                <span className="text-xs text-matrix-green/60">
                  {agents.length} AGENTS ACTIVE
                </span>
              </div>
              
              <AgentNetwork 
                agents={agents}
                phase={currentPhase}
                activeAgentId={activeAgentId}
              />
            </section>
          </div>

          {/* Metrics Dashboard */}
          <div className="col-span-3">
            <MetricsDashboard
              iteration={currentIteration}
              maxIterations={maxIterations}
              consensus={consensus}
              totalAgents={agents.length}
              totalIdeas={totalIdeas}
              avgNovelty={avgNovelty}
              avgViability={avgViability}
              phase={currentPhase}
            />
          </div>
        </div>

        {/* Bottom Row - Controls, Tree, and Log */}
        <div className="grid grid-cols-12 gap-4">
          {/* Left Column - Control Panel */}
          <div className="col-span-3 space-y-4">
          {/* Evolution Mandate Input */}
          <section className="agent-card">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-matrix-green/30">
              <Terminal className="w-4 h-4" />
              <h2 className="text-sm font-display">EVOLUTION MANDATE</h2>
            </div>
            
            <form onSubmit={startEvolution} className="space-y-4">
              <div>
                <label className="block text-sm text-matrix-glow mb-2">EVOLUTION MANDATE</label>
                <input 
                  type="text" 
                  name="title"
                  placeholder="Describe the challenge to solve..."
                  className="w-full bg-black/80 border border-matrix-green/30 px-3 py-2 text-matrix-green font-mono text-sm focus:outline-none focus:border-matrix-green"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-matrix-glow/60 mb-1">DOMAIN</label>
                  <select 
                    name="domain"
                    className="w-full bg-black/80 border border-matrix-green/30 px-2 py-1 text-matrix-green font-mono text-xs focus:outline-none"
                  >
                    <option>sustainability</option>
                    <option>healthcare</option>
                    <option>education</option>
                    <option>research</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-matrix-glow/60 mb-1">MAX ITERATIONS</label>
                  <input 
                    type="number" 
                    name="maxIterations"
                    defaultValue="8"
                    className="w-full bg-black/80 border border-matrix-green/30 px-2 py-1 text-matrix-green font-mono text-xs focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs text-matrix-glow/60 mb-1">MAX AGENTS</label>
                <input 
                  type="number" 
                  name="maxAgents"
                  defaultValue="15"
                  className="w-full bg-black/80 border border-matrix-green/30 px-2 py-1 text-matrix-green font-mono text-xs focus:outline-none"
                />
              </div>
              
              <button 
                type="submit"
                className="btn-matrix w-full"
                disabled={!isConnected}
              >
                <Zap className="w-4 h-4" />
                INITIATE EVOLUTION
              </button>
            </form>
          </section>

          {/* Remove old System Status - now handled by MetricsDashboard */}
        </div>

        {/* Center Column - Family Tree */}
        <div className="col-span-6">
          <section className="agent-card h-[600px]">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-matrix-green/30">
              <div className="flex items-center gap-2">
                <Dna className="w-4 h-4" />
                <h2 className="text-sm font-display">AGENT LINEAGE</h2>
              </div>
              <span className="text-xs text-matrix-green/60">GENERATION 001</span>
            </div>
            
            {/* Family Tree Canvas */}
            <div className="h-[520px] border border-matrix-green/20 relative">
              <FamilyTree />
            </div>
          </section>
        </div>

        {/* Right Column - Evolution Log */}
        <div className="col-span-3">
          <section className="agent-card h-[600px] flex flex-col">
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-matrix-green/30">
              <Terminal className="w-4 h-4" />
              <h2 className="text-sm font-display">EVOLUTION LOG</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-1 font-mono text-xs text-matrix-green/70">
              {evolutionLog.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
              <div className="terminal-cursor">_</div>
            </div>
          </section>
        </div>
      </div>
      </div>

      {/* Footer Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-matrix-green bg-black/95 px-6 py-2 backdrop-blur-sm">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="text-matrix-green/60">EVOFORGE NEXUS v0.1.0</span>
            <span className="text-matrix-green/30">|</span>
            <span className="text-matrix-green/60">ADK-TS HACKATHON 2025</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className={isActive ? 'status-active' : 'text-matrix-green/40'}>
              LATENCY: <span className="text-terminal-amber">{latency}ms</span>
            </span>
            <span className="text-matrix-green/30">|</span>
            <span className={isConnected ? 'status-active' : 'text-matrix-green/40'}>
              API: <span className={isConnected ? 'text-matrix-glow' : 'text-red-500'}>
                {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
