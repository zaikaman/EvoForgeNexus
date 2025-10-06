/**
 * Configuration constants for EvoForge Nexus
 */

// Evolution parameters
export const EVOLUTION_CONFIG = {
  DEFAULT_MAX_ITERATIONS: 10,
  DEFAULT_MAX_AGENTS: 20,
  DEFAULT_MUTATION_RATE: 0.3,
  CONSENSUS_THRESHOLD: 0.65, // Lowered to trigger spawning easier
  CONVERGENCE_THRESHOLD: 0.85,
  MIN_AGENT_FITNESS: 0.4,
  SPAWN_COOLDOWN_MS: 2000,
} as const;

// Default trait values for new agents
export const DEFAULT_TRAITS = {
  creativity: 0.5,
  precision: 0.5,
  speed: 0.5,
  collaboration: 0.5,
} as const;

// LLM model configurations (using OpenAI GPT-5-nano)
export const MODEL_CONFIG = {
  IDEATOR: process.env.DEFAULT_IDEATOR_MODEL || 'gpt-5-nano',
  SIMULATOR: process.env.DEFAULT_SIMULATOR_MODEL || 'gpt-5-nano',
  CRITIC: process.env.DEFAULT_CRITIC_MODEL || 'gpt-5-nano',
  SYNTHESIS: process.env.DEFAULT_SYNTHESIS_MODEL || 'gpt-5-nano',
} as const;

// Agent capabilities
export const CAPABILITIES = {
  IDEATION: 'ideation',
  SIMULATION: 'simulation',
  CRITIQUE: 'critique',
  SYNTHESIS: 'synthesis',
  OPTIMIZATION: 'optimization',
  RESEARCH: 'research',
} as const;

// Fitness score weights
export const FITNESS_WEIGHTS = {
  solutionQuality: 0.4,
  efficiency: 0.2,
  novelty: 0.25,
  feasibility: 0.15,
} as const;
