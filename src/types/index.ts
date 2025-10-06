/**
 * Core type definitions for EvoForge Nexus
 * Self-Genesis Multi-Agent Ecosystem
 */

/**
 * Agent DNA - The genetic code structure that defines agent behavior
 */
export interface AgentDNA {
  id: string;
  name: string;
  traits: {
    creativity: number;      // 0-1: How creative/exploratory the agent is
    precision: number;       // 0-1: How precise/accurate the agent is
    speed: number;           // 0-1: How quickly the agent processes
    collaboration: number;   // 0-1: How well agent works with others
  };
  capabilities: string[];    // List of capabilities (e.g., "ideation", "simulation")
  model: string;            // LLM model to use (e.g., "gpt-5-nano")
  instructions: string;     // System instructions for the agent
  toolNames: string[];      // Tools available to this agent
  parentIds?: string[];     // Parent agent IDs (for lineage tracking)
  generation: number;       // Generation number in evolution
  birthTimestamp: number;   // When this agent was created
  mutations: Mutation[];    // History of mutations applied
}

/**
 * Mutation record - Track changes to agent DNA
 */
export interface Mutation {
  type: 'trait_adjustment' | 'capability_addition' | 'tool_addition' | 'instruction_modification';
  timestamp: number;
  description: string;
  changes: Record<string, any>;
}

/**
 * Agent Genome - Extended genetic information with performance metrics
 */
export interface AgentGenome extends AgentDNA {
  fitnessScore: number;          // Overall fitness (0-1)
  performanceMetrics: {
    tasksCompleted: number;
    averageQuality: number;      // 0-1
    averageSpeed: number;        // ms
    successRate: number;         // 0-1
    collaborationScore: number;  // 0-1
  };
  offspring: string[];           // IDs of child agents
  status: 'active' | 'inactive' | 'retired';
}

/**
 * Evolution Mandate - User input defining the problem to solve
 */
export interface EvolutionMandate {
  id: string;
  title: string;
  description: string;           // High-level problem description
  constraints?: string[];        // Constraints or limitations
  successCriteria: string[];     // What defines success
  domain?: string;               // Domain area (e.g., "agriculture", "climate")
  maxIterations?: number;        // Max evolution cycles
  maxAgents?: number;            // Max concurrent agents
  timestamp: number;
}

/**
 * Fitness Score - Evaluation metrics for agent performance
 */
export interface FitnessScore {
  agentId: string;
  overall: number;               // 0-1: Overall fitness
  components: {
    solutionQuality: number;     // How good is the solution
    efficiency: number;          // How efficiently was it achieved
    novelty: number;             // How novel/creative is the approach
    feasibility: number;         // How feasible is implementation
  };
  evaluatedAt: number;
  evaluatorId?: string;          // Which agent evaluated this
  notes?: string;
}

/**
 * Agent Lineage - Family tree tracking
 */
export interface AgentLineage {
  agentId: string;
  parentIds: string[];
  childrenIds: string[];
  generation: number;
  branch: string;                // Branch identifier for visualization
  epigeneticMemory: {            // Inherited knowledge from parents
    keyInsights: string[];
    learnedPatterns: string[];
    avoidedMistakes: string[];
  };
}

/**
 * Evolution Cycle Result - Output of one evolution iteration
 */
export interface EvolutionCycleResult {
  iteration: number;
  timestamp: number;
  agentsInvolved: string[];
  ideas: IdeaProposal[];
  simulations: SimulationResult[];
  critiques: CritiqueResult[];
  synthesis: SynthesisResult;
  newAgentsSpawned: string[];
  agentsRetired: string[];
  consensusReached: boolean;
  breakthroughDetected: boolean;
}

/**
 * Idea Proposal - Output from Ideator agents
 */
export interface IdeaProposal {
  id: string;
  agentId: string;
  title: string;
  description: string;
  approach: string;
  noveltyScore: number;          // 0-1
  timestamp: number;
}

/**
 * Simulation Result - Output from Simulator agents
 */
export interface SimulationResult {
  id: string;
  agentId: string;
  ideaId: string;
  viabilityScore: number;        // 0-1
  metrics: Record<string, number>;
  risks: string[];
  recommendations: string[];
  timestamp: number;
}

/**
 * Critique Result - Output from Critic agents
 */
export interface CritiqueResult {
  id: string;
  agentId: string;
  targetId: string;              // ID of idea/simulation being critiqued
  flaws: string[];
  strengths: string[];
  biasesDetected: string[];
  overallAssessment: 'approve' | 'reject' | 'needs_revision';
  confidence: number;            // 0-1
  timestamp: number;
}

/**
 * Synthesis Result - Combined output from all agents
 */
export interface SynthesisResult {
  id: string;
  agentId: string;
  topIdeas: string[];            // IDs of best ideas
  combinedApproach: string;      // Synthesized solution
  consensusLevel: number;        // 0-1
  readyForSpawn: boolean;        // Should we spawn new agents?
  spawnRecommendations?: {
    traitMix: Partial<AgentDNA['traits']>;
    capabilities: string[];
    reasoning: string;
  };
  timestamp: number;
}

/**
 * Swarm State - Current state of the agent ecosystem
 */
export interface SwarmState {
  mandateId: string;
  totalAgents: number;
  activeAgents: string[];
  retiredAgents: string[];
  currentGeneration: number;
  totalIterations: number;
  bestSolution?: SynthesisResult;
  convergenceScore: number;      // 0-1: How close to solution
  timestamp: number;
}

/**
 * Agent Spawn Request - Request to create a new agent
 */
export interface AgentSpawnRequest {
  parentIds: string[];
  traitMix: Partial<AgentDNA['traits']>;
  capabilities: string[];
  reasoning: string;
  priority?: number;
}

/**
 * Evolution Event - Real-time events for WebSocket streaming
 */
export interface EvolutionEvent {
  type: 'agent_spawn' | 'agent_retire' | 'idea_proposed' | 'simulation_complete' | 
        'critique_complete' | 'synthesis_complete' | 'iteration_complete' | 
        'breakthrough_detected' | 'convergence_reached';
  timestamp: number;
  data: any;
  mandateId: string;
}
