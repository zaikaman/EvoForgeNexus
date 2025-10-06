/**
 * Evolution Service
 * Integrates real EvolutionCycle with API
 */

import { EvolutionCycle } from '../../../../src/core/orchestration/evolution-cycle.js';
import { broadcast } from '../index.js';
import type { EvolutionMandate } from '../../../../src/types/index.js';

interface EvolutionSession {
  id: string;
  mandate: EvolutionMandate;
  cycle: EvolutionCycle;
  status: 'running' | 'completed' | 'failed';
  startTime: number;
  events: any[];
}

const sessions = new Map<string, EvolutionSession>();

export async function startEvolution(mandate: EvolutionMandate): Promise<string> {
  const sessionId = `evo_${Date.now()}`;
  
  try {
    console.log(`🚀 Starting evolution: ${sessionId}`);
    console.log(`📋 Mandate: ${mandate.title}`);

    // Normalize mandate structure for agents
    const normalizedMandate: EvolutionMandate = {
      id: sessionId,
      title: mandate.title,
      description: mandate.title, // Use title as description if not provided
      domain: mandate.domain || 'general',
      successCriteria: ['High innovation', 'Practical feasibility', 'Scalability'],
      constraints: [],
      maxIterations: mandate.maxIterations || 5,
      maxAgents: mandate.maxAgents || 15,
      timestamp: Date.now(),
    };

    // Create evolution cycle directly
    const cycle = new EvolutionCycle(normalizedMandate, {
      maxIterations: normalizedMandate.maxIterations,
      maxAgents: normalizedMandate.maxAgents,
      enableSpawning: true,
    });

    // Store session
    const session: EvolutionSession = {
      id: sessionId,
      mandate: normalizedMandate,
      cycle,
      status: 'running',
      startTime: Date.now(),
      events: [],
    };
    sessions.set(sessionId, session);

    // Broadcast start event
    broadcast({
      type: 'evolution_start',
      evolutionId: sessionId,
      mandate: normalizedMandate.title,
      timestamp: Date.now(),
    });

    // Run evolution in background
    runEvolutionCycle(session).catch((error) => {
      console.error('❌ Evolution failed:', error);
      session.status = 'failed';
      broadcast({
        type: 'evolution_error',
        evolutionId: sessionId,
        error: error.message,
        timestamp: Date.now(),
      });
    });

    return sessionId;
  } catch (error) {
    console.error('❌ Failed to start evolution:', error);
    throw error;
  }
}

async function runEvolutionCycle(session: EvolutionSession) {
  const { id, cycle, mandate } = session;
  
  try {
    console.log(`⚡ Running evolution cycle: ${id}`);

    // Hook into cycle to broadcast real-time events
    let currentIteration = 0;

    // Override console.log temporarily to capture cycle events
    const originalLog = console.log;
    console.log = (...args: any[]) => {
      originalLog(...args);
      
      const message = args.join(' ');
      
      // Broadcast iteration start
      if (message.includes('ITERATION')) {
        const iterMatch = message.match(/ITERATION (\d+)\/(\d+)/);
        if (iterMatch) {
          currentIteration = parseInt(iterMatch[1]);
          const maxIterations = parseInt(iterMatch[2]);
          broadcast({
            type: 'iteration_start',
            evolutionId: id,
            iteration: currentIteration,
            maxIterations: maxIterations,
            timestamp: Date.now(),
          });
        }
      }
      
      // Broadcast phase changes
      if (message.includes('💡 IDEATION PHASE')) {
        broadcast({
          type: 'phase_change',
          evolutionId: id,
          phase: 'ideation',
          iteration: currentIteration,
          timestamp: Date.now(),
        });
      }
      
      if (message.includes('✅ Total ideas generated:')) {
        const ideasMatch = message.match(/generated: (\d+)/);
        if (ideasMatch) {
          broadcast({
            type: 'ideas_generated',
            evolutionId: id,
            count: parseInt(ideasMatch[1]),
            avgNovelty: 0.75, // Default value
            timestamp: Date.now(),
          });
        }
      }
      
      if (message.includes('🧪 SIMULATION PHASE')) {
        broadcast({
          type: 'phase_change',
          evolutionId: id,
          phase: 'simulation',
          iteration: currentIteration,
          timestamp: Date.now(),
        });
      }
      
      if (message.includes('✅ Total simulations:')) {
        const simMatch = message.match(/simulations: (\d+)/);
        if (simMatch) {
          broadcast({
            type: 'simulation_complete',
            evolutionId: id,
            count: parseInt(simMatch[1]),
            viabilityScores: [0.7, 0.8, 0.6, 0.75, 0.85], // Default values
            timestamp: Date.now(),
          });
        }
      }
      
      if (message.includes('🔍 CRITIQUE PHASE')) {
        broadcast({
          type: 'phase_change',
          evolutionId: id,
          phase: 'critique',
          iteration: currentIteration,
          timestamp: Date.now(),
        });
      }
      
      if (message.includes('✅ Total critiques:')) {
        const critMatch = message.match(/critiques: (\d+)/);
        if (critMatch) {
          broadcast({
            type: 'log',
            evolutionId: id,
            message: `Completed ${critMatch[1]} critiques`,
            timestamp: Date.now(),
          });
        }
      }
      
      if (message.includes('🔗 SYNTHESIS PHASE')) {
        broadcast({
          type: 'phase_change',
          evolutionId: id,
          phase: 'synthesis',
          iteration: currentIteration,
          timestamp: Date.now(),
        });
      }
      
      if (message.includes('✅ Consensus level:')) {
        const consMatch = message.match(/level: ([\d.]+)/);
        if (consMatch) {
          broadcast({
            type: 'consensus_update',
            evolutionId: id,
            iteration: currentIteration,
            consensus: parseFloat(consMatch[1]),
            timestamp: Date.now(),
          });
        }
      }
      
      // Broadcast agent spawning
      if (message.includes('spawned:') || message.includes('Spawned')) {
        // Match patterns like "New ideator spawned:" or "Spawned 2 new agent(s)"
        const typeMatch = message.match(/(\w+) spawned:/i);
        const countMatch = message.match(/Spawned (\d+) new agent/);
        
        if (typeMatch) {
          // Individual agent spawn
          broadcast({
            type: 'agent_spawned',
            evolutionId: id,
            agentId: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            agentType: typeMatch[1],
            generation: currentIteration,
            timestamp: Date.now(),
          });
        } else if (countMatch) {
          // Batch spawn - send multiple events
          const count = parseInt(countMatch[1]);
          for (let i = 0; i < count; i++) {
            broadcast({
              type: 'agent_spawned',
              evolutionId: id,
              agentId: `agent_${Date.now()}_${i}`,
              agentType: 'specialist',
              generation: currentIteration,
              timestamp: Date.now(),
            });
          }
        }
      }
      
      // Broadcast iteration complete
      if (message.includes('Ready for spawn:')) {
        broadcast({
          type: 'iteration_complete',
          evolutionId: id,
          iteration: currentIteration,
          timestamp: Date.now(),
        });
      }
    };

    // Run evolution
    const result = await cycle.run();

    // Restore console.log
    console.log = originalLog;

    // Broadcast completion
    session.status = 'completed';
    broadcast({
      type: 'evolution_complete',
      evolutionId: id,
      results: {
        topIdeas: result.finalSynthesis?.topIdeas || [],
        combinedApproach: result.finalSynthesis?.combinedApproach || 'Evolution completed',
        consensusLevel: result.finalSynthesis?.consensusLevel || 0,
        iterations: result.iterations,
        breakthrough: result.convergenceReason.includes('Breakthrough'),
      },
      timestamp: Date.now(),
    });

    console.log(`✅ Evolution completed: ${id}`);
    console.log(`   Iterations: ${result.iterations}`);
    console.log(`   Consensus: ${result.finalSynthesis?.consensusLevel || 0}`);
    console.log(`   Reason: ${result.convergenceReason}`);
  } catch (error) {
    console.error(`❌ Evolution cycle failed: ${id}`, error);
    throw error;
  }
}

export function getEvolutionStatus(sessionId: string) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  return {
    id: session.id,
    status: session.status,
    mandate: session.mandate,
    startTime: session.startTime,
    executionTime: Date.now() - session.startTime,
    events: session.events,
  };
}

export function getEvolutionLineage(sessionId: string) {
  const session = sessions.get(sessionId);
  if (!session) return null;

  // Return empty lineage for now - will implement later
  return {
    agents: [],
    tree: {},
  };
}

export function getAllSessions() {
  return Array.from(sessions.values()).map((session) => ({
    id: session.id,
    status: session.status,
    mandate: session.mandate.title,
    startTime: session.startTime,
  }));
}
