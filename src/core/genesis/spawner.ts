/**
 * Agent Spawner - Runtime Agent Creation
 * Core innovation: Dynamically spawn new agents based on synthesis recommendations
 */

import type { AgentDNA, SynthesisResult } from '../../types/index.js';
import { createDNA, breedAgents } from './dna.js';
import { MODEL_CONFIG } from '../../utils/config.js';

type AgentTraits = AgentDNA['traits'];

/**
 * Spawn a new agent from scratch based on synthesis recommendations
 */
export function spawnFromRecommendation(
  synthesis: SynthesisResult,
  baseModel: string = MODEL_CONFIG.SIMULATOR
): AgentDNA | null {
  if (!synthesis.readyForSpawn || !synthesis.spawnRecommendations) {
    return null;
  }

  const rec = synthesis.spawnRecommendations;
  
  // Extract traits from recommendation
  const traits: AgentTraits = {
    creativity: rec.traitMix?.creativity ?? 0.7,
    precision: rec.traitMix?.precision ?? 0.7,
    speed: rec.traitMix?.speed ?? 0.7,
    collaboration: rec.traitMix?.collaboration ?? 0.7,
  };

  // Build instructions from reasoning
  const instructions = `
You are a specialized agent created through evolutionary synthesis.

Mission: ${rec.reasoning}

Your capabilities: ${rec.capabilities.join(', ')}

Your traits:
- Creativity: ${traits.creativity.toFixed(2)}
- Precision: ${traits.precision.toFixed(2)}
- Speed: ${traits.speed.toFixed(2)}
- Collaboration: ${traits.collaboration.toFixed(2)}

Use these capabilities to advance the evolution mandate.
  `.trim();

  return createDNA(
    'evolved_specialist',
    traits,
    rec.capabilities,
    baseModel,
    instructions,
    [], // No tools initially
    [] // No parents for first-gen spawns
  );
}

/**
 * Spawn a hybrid agent by breeding two existing agents
 */
export function spawnHybrid(
  parent1: AgentDNA,
  parent2: AgentDNA,
  mutationRate: number = 0.3
): AgentDNA {
  return breedAgents(parent1, parent2, mutationRate);
}

/**
 * Spawn multiple agents from a pool using tournament selection
 * Simulates natural selection for breeding
 */
export function spawnGeneration(
  parentPool: AgentDNA[],
  populationSize: number,
  mutationRate: number = 0.3
): AgentDNA[] {
  if (parentPool.length < 2) {
    throw new Error('Need at least 2 parents to spawn generation');
  }

  const offspring: AgentDNA[] = [];

  for (let i = 0; i < populationSize; i++) {
    // Tournament selection: pick 2 random parents
    const parent1 = parentPool[Math.floor(Math.random() * parentPool.length)];
    let parent2 = parentPool[Math.floor(Math.random() * parentPool.length)];
    
    // Ensure different parents
    while (parent2.id === parent1.id && parentPool.length > 1) {
      parent2 = parentPool[Math.floor(Math.random() * parentPool.length)];
    }

    // Breed offspring
    const child = spawnHybrid(parent1, parent2, mutationRate);
    offspring.push(child);
  }

  return offspring;
}

/**
 * Spawn specialist agent for specific capability
 */
export function spawnSpecialist(
  capability: string,
  baseTraits: AgentTraits,
  model: string = MODEL_CONFIG.IDEATOR
): AgentDNA {
  // Adjust traits based on capability
  const specializedTraits = { ...baseTraits };
  
  switch (capability) {
    case 'ideation':
      specializedTraits.creativity = Math.min(1, baseTraits.creativity + 0.2);
      break;
    case 'simulation':
      specializedTraits.precision = Math.min(1, baseTraits.precision + 0.2);
      break;
    case 'critique':
      specializedTraits.precision = Math.min(1, baseTraits.precision + 0.15);
      specializedTraits.creativity = Math.max(0, baseTraits.creativity - 0.1);
      break;
    case 'synthesis':
      specializedTraits.collaboration = Math.min(1, baseTraits.collaboration + 0.2);
      break;
  }

  const instructions = `
You are a ${capability} specialist agent.

Your primary capability: ${capability}

Optimized traits:
- Creativity: ${specializedTraits.creativity.toFixed(2)}
- Precision: ${specializedTraits.precision.toFixed(2)}
- Speed: ${specializedTraits.speed.toFixed(2)}
- Collaboration: ${specializedTraits.collaboration.toFixed(2)}

Focus on excellence in your specialized domain.
  `.trim();

  return createDNA(
    `specialist_${capability}`,
    specializedTraits,
    [capability],
    model,
    instructions
  );
}

/**
 * Adaptive spawning - spawn agent types based on population needs
 */
export function adaptiveSpawn(
  missingCapabilities: string[],
  averageTraits: AgentTraits,
  model: string = MODEL_CONFIG.IDEATOR
): AgentDNA[] {
  const newAgents: AgentDNA[] = [];

  // Spawn specialists for missing capabilities
  for (const capability of missingCapabilities) {
    const specialist = spawnSpecialist(capability, averageTraits, model);
    newAgents.push(specialist);
  }

  return newAgents;
}

/**
 * Calculate average traits across population
 */
export function calculateAverageTraits(population: AgentDNA[]): AgentTraits {
  if (population.length === 0) {
    return { creativity: 0.5, precision: 0.5, speed: 0.5, collaboration: 0.5 };
  }

  const sum = population.reduce(
    (acc, agent) => ({
      creativity: acc.creativity + agent.traits.creativity,
      precision: acc.precision + agent.traits.precision,
      speed: acc.speed + agent.traits.speed,
      collaboration: acc.collaboration + agent.traits.collaboration,
    }),
    { creativity: 0, precision: 0, speed: 0, collaboration: 0 }
  );

  return {
    creativity: sum.creativity / population.length,
    precision: sum.precision / population.length,
    speed: sum.speed / population.length,
    collaboration: sum.collaboration / population.length,
  };
}

/**
 * Identify missing capabilities in current population
 */
export function findMissingCapabilities(
  population: AgentDNA[],
  requiredCapabilities: string[]
): string[] {
  const existingCapabilities = new Set<string>();
  
  for (const agent of population) {
    for (const cap of agent.capabilities) {
      existingCapabilities.add(cap);
    }
  }

  return requiredCapabilities.filter(cap => !existingCapabilities.has(cap));
}
