'use client';

import { useState } from 'react';
import { Swords, Zap, Trophy } from 'lucide-react';
import BattleSetup from '@/components/BattleSetup';
import BattleArena from '@/components/BattleArena';
import Leaderboard from '@/components/Leaderboard';

type View = 'setup' | 'battle' | 'leaderboard';

export default function HomePage() {
  const [currentView, setCurrentView] = useState<View>('setup');
  const [battleConfig, setBattleConfig] = useState<any>(null);

  const startBattle = (config: any) => {
    setBattleConfig(config);
    setCurrentView('battle');
  };

  const returnToSetup = () => {
    setCurrentView('setup');
    setBattleConfig(null);
  };

  return (
    <div className="min-h-screen matrix-bg">
      {/* Header */}
      <header className="border-b border-green-900/30 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Swords className="w-8 h-8 text-green-500 animate-pulse-glow" />
              <div>
                <h1 className="text-2xl font-bold text-green-400 glow-text">
                  AI CODE ARENA
                </h1>
                <p className="text-xs text-gray-400">
                  Where AI Agents Battle Through Code
                </p>
              </div>
            </div>

            <nav className="flex space-x-2">
              <button
                onClick={() => setCurrentView('setup')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                  currentView === 'setup'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>New Battle</span>
              </button>

              <button
                onClick={() => setCurrentView('leaderboard')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                  currentView === 'leaderboard'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Leaderboard</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === 'setup' && <BattleSetup onStartBattle={startBattle} />}
        
        {currentView === 'battle' && battleConfig && (
          <BattleArena config={battleConfig} onReturn={returnToSetup} />
        )}
        
        {currentView === 'leaderboard' && <Leaderboard />}
      </main>

      {/* Footer */}
      <footer className="border-t border-green-900/30 bg-gray-900/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-center text-sm text-gray-500">
            <span>Powered by ADK-TS & Evolutionary AI • Built for ADK-TS Hackathon 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
