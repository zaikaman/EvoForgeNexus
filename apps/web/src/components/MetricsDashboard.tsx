'use client';

import { motion } from 'framer-motion';
import { Activity, Zap, TrendingUp, Users, Lightbulb, Target } from 'lucide-react';

interface MetricsDashboardProps {
  iteration: number;
  maxIterations: number;
  consensus: number;
  totalAgents?: number;
  agentCount?: number;
  totalIdeas: number;
  avgNovelty?: number;
  novelty?: number;
  avgViability?: number;
  viability?: number[];
  phase?: 'ideation' | 'simulation' | 'critique' | 'synthesis' | null;
}

export function MetricsDashboard({
  iteration,
  maxIterations,
  consensus,
  totalAgents,
  agentCount,
  totalIdeas,
  avgNovelty,
  novelty,
  avgViability,
  viability,
  phase,
}: MetricsDashboardProps) {
  const agents = totalAgents || agentCount || 0;
  const noveltyScore = avgNovelty || novelty || 0;
  const viabilityScore = avgViability || (viability && viability.length > 0 ? viability.reduce((a, b) => a + b, 0) / viability.length : 0);

  const metrics = [
    {
      label: 'Consensus',
      value: Math.round(consensus * 100),
      max: 100,
      unit: '%',
      icon: Target,
      color: '#00ff88',
      description: 'Agent agreement level',
    },
    {
      label: 'Agents',
      value: agents,
      max: 15,
      unit: '',
      icon: Users,
      color: '#00ffaa',
      description: 'Active agents in swarm',
    },
    {
      label: 'Ideas',
      value: totalIdeas,
      max: 100,
      unit: '',
      icon: Lightbulb,
      color: '#88ff00',
      description: 'Total ideas generated',
    },
    {
      label: 'Novelty',
      value: Math.round(noveltyScore * 100),
      max: 100,
      unit: '%',
      icon: Zap,
      color: '#00ffcc',
      description: 'Average idea novelty',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Iteration Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-6 bg-gradient-to-br from-gray-900 via-green-900/10 to-gray-900 rounded-lg border-2 border-matrix-green/30 overflow-hidden"
      >
        {/* Scanline effect */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute w-full h-1 bg-gradient-to-r from-transparent via-matrix-green/50 to-transparent"
            animate={{ y: [0, 300, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          />
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-matrix-green font-mono text-sm uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Evolution Progress
            </h3>
            <span className="text-matrix-green font-mono text-xl font-bold">
              {iteration}/{maxIterations}
            </span>
          </div>

          {/* Progress bar */}
          <div className="relative h-8 bg-gray-800/50 rounded border border-matrix-green/30 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-matrix-green/80 via-matrix-green to-matrix-green/80"
              initial={{ width: 0 }}
              animate={{ width: `${(iteration / maxIterations) * 100}%` }}
              transition={{ duration: 0.5 }}
              style={{
                boxShadow: '0 0 20px currentColor',
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-mono text-sm font-bold mix-blend-difference">
                ITERATION {iteration}
              </span>
            </div>
          </div>

          {/* Phase indicator */}
          {phase && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-matrix-green/10 border border-matrix-green/30 rounded-full">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-2 h-2 bg-matrix-green rounded-full"
                />
                <span className="text-matrix-green font-mono text-xs uppercase">
                  {phase}
                </span>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => {
          const percentage = ((metric.value || 0) / metric.max) * 100;
          const Icon = metric.icon;

          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative p-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg border-2 overflow-hidden group hover:border-opacity-100 transition-all"
              style={{ borderColor: `${metric.color}40` }}
            >
              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${metric.color}, transparent)`,
                }}
              />

              <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" style={{ color: metric.color }} />
                    <span className="font-mono text-xs uppercase tracking-wide" style={{ color: metric.color }}>
                      {metric.label}
                    </span>
                  </div>
                  <span className="font-mono text-2xl font-bold" style={{ color: metric.color }}>
                    {metric.value}
                    <span className="text-sm opacity-60">{metric.unit}</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    style={{
                      backgroundColor: metric.color,
                      boxShadow: `0 0 10px ${metric.color}`,
                    }}
                  />
                </div>

                {/* Description */}
                <p className="mt-2 text-xs text-gray-400 font-mono">
                  {metric.description}
                </p>
              </div>

              {/* Corner decoration */}
              <div
                className="absolute top-0 right-0 w-16 h-16 opacity-10"
                style={{
                  background: `linear-gradient(135deg, transparent 50%, ${metric.color} 50%)`,
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Viability indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 rounded-lg border border-matrix-green/20"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm text-gray-400">AVG VIABILITY</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0.2 }}
                  animate={{
                    opacity: i < Math.round((viabilityScore || 0) * 5) ? 1 : 0.2,
                  }}
                  className="w-8 h-2 rounded-full"
                  style={{
                    backgroundColor: i < Math.round((viabilityScore || 0) * 5) ? '#00ff88' : '#333',
                    boxShadow: i < Math.round((viabilityScore || 0) * 5) ? '0 0 5px #00ff88' : 'none',
                  }}
                />
              ))}
            </div>
            <span className="font-mono text-xl font-bold text-matrix-green">
              {Math.round((viabilityScore || 0) * 100)}%
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
