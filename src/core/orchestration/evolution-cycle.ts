/**
 * Evolution Cycle - Main Orchestration Loop
 * Implements: ideate → simulate → critique → synthesize → spawn
 */

import type { EvolutionMandate, SynthesisResult } from '../../types/index.js';
import { SwarmCoordinator } from './swarm-coordinator.js';
import { spawnSpecialist, calculateAverageTraits } from '../genesis/spawner.js';
import { EVOLUTION_CONFIG } from '../../utils/config.js';
import { IdeatorAgent } from '../../agents/ideator.js';
import { SimulatorAgent } from '../../agents/simulator.js';
import { CriticAgent } from '../../agents/critic.js';

export interface EvolutionResult {
  success: boolean;
  iterations: number;
  finalSynthesis: SynthesisResult | null;
  totalAgentsSpawned: number;
  executionTime: number;
  convergenceReason: string;
}

export interface EvolutionOptions {
  maxIterations?: number;
  maxAgents?: number;
  convergenceThreshold?: number;
  enableSpawning?: boolean;
}

/**
 * EvolutionCycle - Orchestrates complete evolution process
 */
export class EvolutionCycle {
  private swarm: SwarmCoordinator;
  private mandate: EvolutionMandate;
  private options: Required<EvolutionOptions>;
  
  private currentIteration: number = 0;
  private agentsSpawned: number = 0;
  private startTime: number = 0;
  private previousConsensus: number[] = [];

  constructor(mandate: EvolutionMandate, options: EvolutionOptions = {}) {
    this.mandate = mandate;
    this.swarm = new SwarmCoordinator();
    
    // Set options with defaults
    this.options = {
      maxIterations: options.maxIterations ?? mandate.maxIterations ?? EVOLUTION_CONFIG.DEFAULT_MAX_ITERATIONS,
      maxAgents: options.maxAgents ?? mandate.maxAgents ?? EVOLUTION_CONFIG.DEFAULT_MAX_AGENTS,
      convergenceThreshold: options.convergenceThreshold ?? EVOLUTION_CONFIG.CONVERGENCE_THRESHOLD,
      enableSpawning: options.enableSpawning ?? true,
    };
  }

  /**
   * Run complete evolution cycle
   */
  async run(): Promise<EvolutionResult> {
    this.startTime = Date.now();
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('🌟 EVOLUTION CYCLE STARTED');
    console.log('═══════════════════════════════════════════════════════\n');
    console.log(`📋 Mandate: ${this.mandate.title}`);
    console.log(`   Max Iterations: ${this.options.maxIterations}`);
    console.log(`   Max Agents: ${this.options.maxAgents}`);
    console.log(`   Spawning: ${this.options.enableSpawning ? 'ENABLED' : 'DISABLED'}\n`);

    // Initialize base swarm
    this.swarm.initializeSwarm(1, 1, 1);

    let finalSynthesis: SynthesisResult | null = null;
    let convergenceReason = 'Max iterations reached';

    // Main evolution loop
    for (this.currentIteration = 1; this.currentIteration <= this.options.maxIterations; this.currentIteration++) {
      console.log('\n═══════════════════════════════════════════════════════');
      console.log(`ITERATION ${this.currentIteration}/${this.options.maxIterations}`);
      console.log('═══════════════════════════════════════════════════════');

      // Execute evolution phases
      const ideas = await this.swarm.executeIdeation(this.mandate, 2);
      const simulations = await this.swarm.executeSimulation(ideas);
      const critiques = await this.swarm.executeCritique(ideas);
      const synthesis = await this.swarm.executeSynthesis(ideas, simulations, critiques);

      finalSynthesis = synthesis;
      this.previousConsensus.push(synthesis.consensusLevel);

      // Check for convergence
      if (this.checkConvergence(synthesis)) {
        convergenceReason = 'Convergence achieved';
        console.log(`\n✅ CONVERGENCE DETECTED at iteration ${this.currentIteration}`);
        break;
      }

      // Check for breakthrough
      if (synthesis.consensusLevel >= this.options.convergenceThreshold) {
        convergenceReason = 'Breakthrough solution found';
        console.log(`\n🎯 BREAKTHROUGH! Consensus: ${synthesis.consensusLevel.toFixed(2)}`);
        break;
      }

      // Spawn new agents if enabled
      if (this.options.enableSpawning && synthesis.readyForSpawn) {
        await this.spawnNewAgents(synthesis);
      }

      // Check agent limit
      const stats = this.swarm.getStats();
      if (stats.totalAgents >= this.options.maxAgents) {
        convergenceReason = 'Max agents reached';
        console.log(`\n⚠️ Agent limit reached: ${stats.totalAgents}/${this.options.maxAgents}`);
        break;
      }
    }

    const executionTime = Date.now() - this.startTime;

    // Print final results
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('📊 EVOLUTION CYCLE COMPLETED');
    console.log('═══════════════════════════════════════════════════════\n');
    
    const finalStats = this.swarm.getStats();
    console.log(`Iterations: ${this.currentIteration}`);
    console.log(`Convergence: ${convergenceReason}`);
    console.log(`Total Agents: ${finalStats.totalAgents}`);
    console.log(`Agents Spawned: ${this.agentsSpawned}`);
    console.log(`Total Ideas: ${finalStats.totalIdeas}`);
    console.log(`Average Novelty: ${finalStats.averageNovelty.toFixed(2)}`);
    console.log(`Average Viability: ${finalStats.averageViability.toFixed(2)}`);
    console.log(`Final Consensus: ${finalStats.consensusLevel.toFixed(2)}`);
    console.log(`Execution Time: ${(executionTime / 1000).toFixed(1)}s\n`);

    if (finalSynthesis?.topIdeas) {
      console.log(`🏆 TOP SOLUTIONS:`);
      finalSynthesis.topIdeas.slice(0, 3).forEach((id, i) => {
        const idea = this.swarm.getState().ideas.find(idea => idea.id === id);
        if (idea) {
          console.log(`   ${i + 1}. ${idea.title} (Novelty: ${idea.noveltyScore.toFixed(2)})`);
        }
      });
    }

    return {
      success: finalSynthesis !== null,
      iterations: this.currentIteration,
      finalSynthesis,
      totalAgentsSpawned: this.agentsSpawned,
      executionTime,
      convergenceReason,
    };
  }

  /**
   * Check if evolution has converged
   */
  private checkConvergence(synthesis: SynthesisResult): boolean {
    // Need at least 3 iterations to check convergence
    if (this.previousConsensus.length < 3) return false;

    // Check if consensus is improving
    const recent = this.previousConsensus.slice(-3);
    const isImproving = recent[2] > recent[0];
    
    // Check if consensus is high enough
    const isHighConsensus = synthesis.consensusLevel >= this.options.convergenceThreshold;

    // Check if consensus is stable (not changing much)
    const variance = this.calculateVariance(recent);
    const isStable = variance < 0.01;

    return isHighConsensus || (isStable && !isImproving);
  }

  /**
   * Calculate variance of consensus values
   */
  private calculateVariance(values: number[]): number {
    const avg = values.reduce((sum, v) => sum + v, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - avg, 2));
    return squaredDiffs.reduce((sum, d) => sum + d, 0) / values.length;
  }

  /**
   * Spawn new agents based on synthesis recommendations
   */
  private async spawnNewAgents(synthesis: SynthesisResult): Promise<void> {
    console.log('\n🧬 SPAWNING NEW AGENTS...');

    if (!synthesis.spawnRecommendations) {
      console.log('   No spawn recommendations');
      return;
    }

    const stats = this.swarm.getStats();
    if (stats.totalAgents >= this.options.maxAgents) {
      console.log(`   ⚠️ Cannot spawn: agent limit reached (${stats.totalAgents}/${this.options.maxAgents})`);
      return;
    }

    // Determine agent type to spawn based on recommendations
    const capabilities = synthesis.spawnRecommendations.capabilities;
    const avgTraits = calculateAverageTraits(this.swarm.getState().activeAgents);

    let spawned = 0;

    // Spawn specialists for missing capabilities
    for (const capability of capabilities) {
      if (spawned >= 2) break; // Limit spawns per iteration

      console.log(`   Creating specialist for: ${capability}`);
      
      const specialistDNA = spawnSpecialist(capability, avgTraits);

      // Instantiate actual agent based on capability
      if (capability === 'ideation') {
        const newAgent = new IdeatorAgent();
        // Copy specialized DNA traits
        Object.assign(newAgent.dna.traits, specialistDNA.traits);
        this.swarm.addIdeator(newAgent);
        spawned++;
      } else if (capability === 'simulation') {
        const newAgent = new SimulatorAgent();
        Object.assign(newAgent.dna.traits, specialistDNA.traits);
        this.swarm.addSimulator(newAgent);
        spawned++;
      } else if (capability === 'critique') {
        const newAgent = new CriticAgent();
        Object.assign(newAgent.dna.traits, specialistDNA.traits);
        this.swarm.addCritic(newAgent);
        spawned++;
      }
    }

    this.agentsSpawned += spawned;
    console.log(`   ✅ Spawned ${spawned} new agent(s)`);
  }

  /**
   * Get current evolution statistics
   */
  getStats() {
    return {
      ...this.swarm.getStats(),
      currentIteration: this.currentIteration,
      agentsSpawned: this.agentsSpawned,
    };
  }
}
