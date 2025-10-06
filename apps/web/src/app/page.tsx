'use client'

import { useState } from 'react'
import { Terminal, Dna, Activity, Zap } from 'lucide-react'

export default function Home() {
  const [isActive, setIsActive] = useState(false)

  return (
    <main className="min-h-screen p-8 grid-overlay">
      {/* Header */}
      <header className="border-2 border-matrix-green p-4 mb-8 relative">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-4xl font-bold terminal-text mb-2">
              EVOFORGE NEXUS
            </h1>
            <p className="text-sm opacity-70">
              Self-Genesis Multi-Agent Ecosystem // v0.1.0
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-matrix-green animate-glow-pulse' : 'bg-gray-600'}`} />
              <span className="text-xs">
                {isActive ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>
            
            <div className="text-xs font-mono">
              AGENTS: <span className="terminal-text">004</span>
            </div>
            
            <div className="text-xs font-mono">
              GEN: <span className="terminal-text">001</span>
            </div>
          </div>
        </div>
        
        {/* Top border decoration */}
        <div className="absolute top-0 left-0 w-16 h-1 bg-matrix-green" />
        <div className="absolute top-0 right-0 w-16 h-1 bg-matrix-green" />
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Left Panel - Evolution Control */}
        <div className="col-span-1 space-y-6">
          {/* Evolution Mandate Terminal */}
          <section className="border border-matrix-green/50 p-4 bg-black/40">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-matrix-green/30">
              <Terminal className="w-5 h-5" />
              <h2 className="font-display text-lg">EVOLUTION MANDATE</h2>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs opacity-70 block mb-1">MISSION TITLE</label>
                <input 
                  type="text"
                  placeholder="Enter evolution objective..."
                  className="w-full bg-black/60 border border-matrix-green/40 p-2 text-sm font-mono focus:border-matrix-green focus:outline-none focus:shadow-matrix transition-all"
                />
              </div>
              
              <div>
                <label className="text-xs opacity-70 block mb-1">DOMAIN</label>
                <select className="w-full bg-black/60 border border-matrix-green/40 p-2 text-sm font-mono focus:border-matrix-green focus:outline-none">
                  <option>Agriculture</option>
                  <option>Healthcare</option>
                  <option>Climate</option>
                  <option>Energy</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs opacity-70 block mb-1">MAX ITERATIONS</label>
                  <input 
                    type="number"
                    defaultValue={5}
                    className="w-full bg-black/60 border border-matrix-green/40 p-2 text-sm font-mono text-center focus:border-matrix-green focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs opacity-70 block mb-1">MAX AGENTS</label>
                  <input 
                    type="number"
                    defaultValue={15}
                    className="w-full bg-black/60 border border-matrix-green/40 p-2 text-sm font-mono text-center focus:border-matrix-green focus:outline-none"
                  />
                </div>
              </div>
              
              <button 
                className="btn-matrix w-full mt-4"
                onClick={() => setIsActive(!isActive)}
              >
                <Zap className="w-4 h-4 inline mr-2" />
                {isActive ? 'TERMINATE' : 'INITIATE EVOLUTION'}
              </button>
            </div>
          </section>

          {/* System Stats */}
          <section className="border border-matrix-green/50 p-4 bg-black/40">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-matrix-green/30">
              <Activity className="w-5 h-5" />
              <h2 className="font-display text-lg">SYSTEM STATUS</h2>
            </div>
            
            <div className="space-y-3 font-mono text-sm">
              <div className="flex justify-between">
                <span className="opacity-70">CONSENSUS</span>
                <span className="terminal-text">0.75</span>
              </div>
              <div className="w-full h-2 bg-black/60 border border-matrix-green/30">
                <div className="h-full bg-matrix-green" style={{ width: '75%' }} />
              </div>
              
              <div className="flex justify-between">
                <span className="opacity-70">NOVELTY</span>
                <span className="terminal-text">0.85</span>
              </div>
              <div className="w-full h-2 bg-black/60 border border-matrix-green/30">
                <div className="h-full bg-matrix-green" style={{ width: '85%' }} />
              </div>
              
              <div className="flex justify-between">
                <span className="opacity-70">VIABILITY</span>
                <span className="terminal-text">0.72</span>
              </div>
              <div className="w-full h-2 bg-black/60 border border-matrix-green/30">
                <div className="h-full bg-matrix-green" style={{ width: '72%' }} />
              </div>
              
              <div className="pt-3 border-t border-matrix-green/30">
                <div className="flex justify-between text-xs">
                  <span>EXECUTION TIME</span>
                  <span className="status-spawning">157.8s</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Center Panel - Family Tree Visualization */}
        <div className="col-span-2 space-y-6">
          {/* Family Tree Canvas */}
          <section className="border border-matrix-green/50 p-4 bg-black/40 h-[600px] relative">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-matrix-green/30">
              <Dna className="w-5 h-5" />
              <h2 className="font-display text-lg">AGENT LINEAGE</h2>
              <span className="ml-auto text-xs opacity-70">GENERATION 001</span>
            </div>
            
            {/* Placeholder for React Flow */}
            <div className="h-[500px] border border-matrix-green/20 flex items-center justify-center relative overflow-hidden">
              <div className="text-center">
                <div className="inline-block px-6 py-3 border-2 border-matrix-green/50 mb-4">
                  <div className="font-display text-2xl terminal-text">GENESIS</div>
                  <div className="text-xs opacity-70 mt-1">AWAITING EVOLUTION CYCLE</div>
                </div>
                
                <div className="mt-8 text-xs opacity-50">
                  <div>[ Family tree will appear here during evolution ]</div>
                  <div className="mt-2">[ Showing agent DNA, mutations, and lineage ]</div>
                </div>
              </div>
              
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-10">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="border-b border-matrix-green/30" style={{ height: '5%' }} />
                ))}
              </div>
            </div>
          </section>

          {/* Evolution Log Terminal */}
          <section className="border border-matrix-green/50 p-4 bg-black/40">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-matrix-green/30">
              <Terminal className="w-5 h-5" />
              <h2 className="font-display text-lg">EVOLUTION LOG</h2>
            </div>
            
            <div className="font-mono text-xs space-y-1 h-32 overflow-y-auto">
              <div className="opacity-70">[00:00:00] System initialized</div>
              <div className="opacity-70">[00:00:01] Base agents spawned: Ideator, Simulator, Critic, Synthesis</div>
              <div className="opacity-70">[00:00:05] Swarm coordinator active</div>
              <div className="terminal-text">[00:00:10] Ready for evolution mandate<span className="terminal-cursor" /></div>
            </div>
          </section>
        </div>
      </div>

      {/* Footer Status Bar */}
      <footer className="fixed bottom-0 left-0 right-0 border-t-2 border-matrix-green bg-black/90 p-2 flex items-center justify-between text-xs font-mono backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <span>EVOFORGE NEXUS v0.1.0</span>
          <span className="opacity-50">|</span>
          <span>ADK-TS HACKATHON 2025</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="opacity-70">LATENCY:</span>
            <span className="status-active">42ms</span>
          </div>
          <span className="opacity-50">|</span>
          <div className="flex items-center gap-2">
            <span className="opacity-70">API:</span>
            <span className="status-active">CONNECTED</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
