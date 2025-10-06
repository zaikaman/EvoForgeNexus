/**
 * Swarm Coordinator - Multi-Agent Orchestration
 * Manages parallel execution, communication, and consensus
 */

import type { 
  AgentDNA, 
  IdeaProposal, 
  SimulationResult, 
  CritiqueResult,
  SynthesisResult 
} from '../../types/index.js';
import { IdeatorAgent } from '../../agents/ideator.js';
import { SimulatorAgent } from '../../agents/simulator.js';
import { CriticAgent } from '../../agents/critic.js';
import { SynthesisAgent } from '../../agents/synthesis.js';

export interface SwarmState {
  activeAgents: AgentDNA[];
  ideas: IdeaProposal[];
  simulations: SimulationResult[];
  critiques: CritiqueResult[];
  synthesis: SynthesisResult | null;
  iteration: number;
  startTime: number;
}

export interface SwarmStats {
  totalAgents: number;
  totalIdeas: number;
  averageNovelty: number;
  averageViability: number;
  consensusLevel: number;
  executionTime: number;
}

/**
 * SwarmCoordinator - Orchestrates multiple agents in parallel
 */
export class SwarmCoordinator {
  private ideators: IdeatorAgent[] = [];
  private simulators: SimulatorAgent[] = [];
  private critics: CriticAgent[] = [];
  private synthesisAgent: SynthesisAgent;
  
  private state: SwarmState;

  constructor() {
    this.synthesisAgent = new SynthesisAgent();
    this.state = this.createInitialState();
  }

  private createInitialState(): SwarmState {
    return {
      activeAgents: [],
      ideas: [],
      simulations: [],
      critiques: [],
      synthesis: null,
      iteration: 0,
      startTime: Date.now(),
    };
  }

  /**
   * Initialize swarm with base agents
   */
  initializeSwarm(ideatorCount: number = 1, simulatorCount: number = 1, criticCount: number = 1) {
    console.log(`🤖 Initializing swarm: ${ideatorCount} ideators, ${simulatorCount} simulators, ${criticCount} critics`);
    
    // Create base agents
    for (let i = 0; i < ideatorCount; i++) {
      const ideator = new IdeatorAgent();
      this.ideators.push(ideator);
      this.state.activeAgents.push(ideator.dna);
    }

    for (let i = 0; i < simulatorCount; i++) {
      const simulator = new SimulatorAgent();
      this.simulators.push(simulator);
      this.state.activeAgents.push(simulator.dna);
    }

    for (let i = 0; i < criticCount; i++) {
      const critic = new CriticAgent();
      this.critics.push(critic);
      this.state.activeAgents.push(critic.dna);
    }

    this.state.activeAgents.push(this.synthesisAgent.dna);
    
    console.log(`✅ Swarm initialized with ${this.state.activeAgents.length} agents`);
  }

  /**
   * Execute ideation phase - all ideators work in parallel
   */
  async executeIdeation(mandate: any, ideasPerAgent: number = 2): Promise<IdeaProposal[]> {
    console.log(`\n💡 IDEATION PHASE (${this.ideators.length} agents generating ${ideasPerAgent} ideas each)`);
    
    const ideationPromises = this.ideators.map(async (ideator, index) => {
      console.log(`   Agent ${index + 1}/${this.ideators.length}: Generating ideas...`);
      try {
        const ideas = await ideator.generateIdeas(mandate, ideasPerAgent);
        console.log(`   ✅ Agent ${index + 1} generated ${ideas.length} ideas`);
        return ideas;
      } catch (error) {
        console.error(`   ❌ Agent ${index + 1} failed:`, error);
        return [];
      }
    });

    const results = await Promise.all(ideationPromises);
    const allIdeas = results.flat();
    
    this.state.ideas.push(...allIdeas);
    console.log(`\n✅ Total ideas generated: ${allIdeas.length}`);
    
    return allIdeas;
  }

  /**
   * Execute simulation phase - all simulators test ideas in parallel
   */
  async executeSimulation(ideas: IdeaProposal[]): Promise<SimulationResult[]> {
    console.log(`\n🧪 SIMULATION PHASE (${this.simulators.length} agents testing ${ideas.length} ideas)`);
    
    // Distribute ideas across simulators
    const ideasPerSimulator = Math.ceil(ideas.length / this.simulators.length);

    const simulationPromises = this.simulators.map(async (simulator, simIndex) => {
      const startIdx = simIndex * ideasPerSimulator;
      const endIdx = Math.min(startIdx + ideasPerSimulator, ideas.length);
      const assignedIdeas = ideas.slice(startIdx, endIdx);

      console.log(`   Simulator ${simIndex + 1}/${this.simulators.length}: Testing ${assignedIdeas.length} ideas...`);

      const results: SimulationResult[] = [];
      for (const idea of assignedIdeas) {
        try {
          const result = await simulator.simulate(idea);
          results.push(result);
        } catch (error) {
          console.error(`   ❌ Simulation failed for "${idea.title}":`, error);
        }
      }

      console.log(`   ✅ Simulator ${simIndex + 1} completed ${results.length}/${assignedIdeas.length} simulations`);
      return results;
    });

    const results = await Promise.all(simulationPromises);
    const allSimulations = results.flat();
    
    this.state.simulations.push(...allSimulations);
    console.log(`\n✅ Total simulations: ${allSimulations.length}`);
    
    return allSimulations;
  }

  /**
   * Execute critique phase - all critics analyze ideas in parallel
   */
  async executeCritique(ideas: IdeaProposal[]): Promise<CritiqueResult[]> {
    console.log(`\n🔍 CRITIQUE PHASE (${this.critics.length} agents analyzing ${ideas.length} ideas)`);
    
    // Distribute ideas across critics
    const ideasPerCritic = Math.ceil(ideas.length / this.critics.length);

    const critiquePromises = this.critics.map(async (critic, criticIndex) => {
      const startIdx = criticIndex * ideasPerCritic;
      const endIdx = Math.min(startIdx + ideasPerCritic, ideas.length);
      const assignedIdeas = ideas.slice(startIdx, endIdx);

      console.log(`   Critic ${criticIndex + 1}/${this.critics.length}: Analyzing ${assignedIdeas.length} ideas...`);

      const results: CritiqueResult[] = [];
      for (const idea of assignedIdeas) {
        try {
          const result = await critic.critique(idea);
          results.push(result);
        } catch (error) {
          console.error(`   ❌ Critique failed for "${idea.title}":`, error);
        }
      }

      console.log(`   ✅ Critic ${criticIndex + 1} completed ${results.length}/${assignedIdeas.length} critiques`);
      return results;
    });

    const results = await Promise.all(critiquePromises);
    const allCritiques = results.flat();
    
    this.state.critiques.push(...allCritiques);
    console.log(`\n✅ Total critiques: ${allCritiques.length}`);
    
    return allCritiques;
  }

  /**
   * Execute synthesis phase - combine all results
   */
  async executeSynthesis(
    ideas: IdeaProposal[], 
    simulations: SimulationResult[], 
    critiques: CritiqueResult[]
  ): Promise<SynthesisResult> {
    console.log(`\n🔗 SYNTHESIS PHASE (combining ${ideas.length} ideas, ${simulations.length} simulations, ${critiques.length} critiques)`);
    
    const synthesis = await this.synthesisAgent.synthesize(ideas, simulations, critiques);
    this.state.synthesis = synthesis;
    
    console.log(`✅ Consensus level: ${synthesis.consensusLevel.toFixed(2)}`);
    console.log(`✅ Top ideas: ${synthesis.topIdeas.length}`);
    console.log(`✅ Ready for spawn: ${synthesis.readyForSpawn ? 'YES' : 'NO'}`);
    
    return synthesis;
  }

  /**
   * Get current swarm statistics
   */
  getStats(): SwarmStats {
    const avgNovelty = this.state.ideas.length > 0
      ? this.state.ideas.reduce((sum, idea) => sum + idea.noveltyScore, 0) / this.state.ideas.length
      : 0;

    const avgViability = this.state.simulations.length > 0
      ? this.state.simulations.reduce((sum, sim) => sum + sim.viabilityScore, 0) / this.state.simulations.length
      : 0;

    return {
      totalAgents: this.state.activeAgents.length,
      totalIdeas: this.state.ideas.length,
      averageNovelty: avgNovelty,
      averageViability: avgViability,
      consensusLevel: this.state.synthesis?.consensusLevel || 0,
      executionTime: Date.now() - this.state.startTime,
    };
  }

  /**
   * Get current swarm state
   */
  getState(): SwarmState {
    return { ...this.state };
  }

  /**
   * Reset swarm for new evolution cycle
   */
  reset() {
    this.state = this.createInitialState();
    this.state.startTime = Date.now();
  }

  /**
   * Add new agent to swarm (for spawning)
   */
  addIdeator(agent: IdeatorAgent) {
    this.ideators.push(agent);
    this.state.activeAgents.push(agent.dna);
    console.log(`✨ New ideator spawned: ${agent.dna.name}`);
  }

  addSimulator(agent: SimulatorAgent) {
    this.simulators.push(agent);
    this.state.activeAgents.push(agent.dna);
    console.log(`✨ New simulator spawned: ${agent.dna.name}`);
  }

  addCritic(agent: CriticAgent) {
    this.critics.push(agent);
    this.state.activeAgents.push(agent.dna);
    console.log(`✨ New critic spawned: ${agent.dna.name}`);
  }

  /**
   * Calculate voting consensus across critics
   */
  calculateVotingConsensus(critiques: CritiqueResult[]): number {
    if (critiques.length === 0) return 0;

    const approvals = critiques.filter(c => c.overallAssessment === 'approve').length;
    return approvals / critiques.length;
  }

  /**
   * Get best ideas based on combined scores
   */
  getBestIdeas(count: number = 3): IdeaProposal[] {
    const scoredIdeas = this.state.ideas.map(idea => {
      const sim = this.state.simulations.find(s => s.ideaId === idea.id);
      const critique = this.state.critiques.find(c => c.targetId === idea.id);
      
      const noveltyScore = idea.noveltyScore;
      const viabilityScore = sim?.viabilityScore || 0;
      const critiqueScore = critique?.confidence || 0;
      
      const combinedScore = (noveltyScore + viabilityScore + critiqueScore) / 3;
      
      return { idea, combinedScore };
    });

    return scoredIdeas
      .sort((a, b) => b.combinedScore - a.combinedScore)
      .slice(0, count)
      .map(item => item.idea);
  }
}
