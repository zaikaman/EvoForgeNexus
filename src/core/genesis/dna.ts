/**
 * DNA Manipulation - Genetic Evolution Functions
 * Core innovation: Agent breeding and trait inheritance
 */

import type { AgentDNA } from '../../types/index.js';
import { generateId } from '../../utils/helpers.js';

type AgentTraits = AgentDNA['traits'];

/**
 * Create base DNA for a new agent
 */
export function createDNA(
  name: string,
  traits: AgentTraits,
  capabilities: string[],
  model: string,
  instructions: string,
  toolNames: string[] = [],
  parentIds?: string[]
): AgentDNA {
  return {
    id: generateId(name),
    name,
    traits,
    capabilities,
    model,
    instructions,
    toolNames,
    parentIds: parentIds || [],
    generation: parentIds ? 1 : 0,
    birthTimestamp: Date.now(),
    mutations: [],
  };
}

/**
 * Mix traits from two parent agents (crossover)
 * Uses weighted average with slight randomization
 */
export function crossoverTraits(parent1: AgentTraits, parent2: AgentTraits): AgentTraits {
  const randomWeight = 0.3 + Math.random() * 0.4; // 0.3-0.7
  
  return {
    creativity: clampTrait(
      parent1.creativity * randomWeight + parent2.creativity * (1 - randomWeight)
    ),
    precision: clampTrait(
      parent1.precision * randomWeight + parent2.precision * (1 - randomWeight)
    ),
    speed: clampTrait(
      parent1.speed * randomWeight + parent2.speed * (1 - randomWeight)
    ),
    collaboration: clampTrait(
      parent1.collaboration * randomWeight + parent2.collaboration * (1 - randomWeight)
    ),
  };
}

/**
 * Mutate traits with random variation
 * Mutation rate controls how much traits can change
 */
export function mutateTraits(traits: AgentTraits, mutationRate: number = 0.1): AgentTraits {
  return {
    creativity: mutateTrait(traits.creativity, mutationRate),
    precision: mutateTrait(traits.precision, mutationRate),
    speed: mutateTrait(traits.speed, mutationRate),
    collaboration: mutateTrait(traits.collaboration, mutationRate),
  };
}

/**
 * Mutate a single trait value
 */
function mutateTrait(value: number, mutationRate: number): number {
  if (Math.random() > mutationRate) return value;
  
  // Random mutation: -20% to +20%
  const delta = (Math.random() - 0.5) * 0.4;
  return clampTrait(value + delta);
}

/**
 * Clamp trait value between 0 and 1
 */
function clampTrait(value: number): number {
  return Math.max(0, Math.min(1, value));
}

/**
 * Merge capabilities from multiple parents
 * Removes duplicates and combines unique capabilities
 */
export function mergeCapabilities(
  caps1: string[],
  caps2: string[]
): string[] {
  const uniqueCaps = new Set([...caps1, ...caps2]);
  return Array.from(uniqueCaps);
}

/**
 * Merge tool names from multiple parents
 */
export function mergeTools(
  tools1: string[],
  tools2: string[]
): string[] {
  const uniqueTools = new Set([...tools1, ...tools2]);
  return Array.from(uniqueTools);
}

/**
 * Breed two agents to create offspring DNA
 * Combines traits, capabilities, and generates hybrid instructions
 */
export function breedAgents(
  parent1: AgentDNA,
  parent2: AgentDNA,
  mutationRate: number = 0.3
): AgentDNA {
  // Crossover traits
  const crossedTraits = crossoverTraits(parent1.traits, parent2.traits);
  
  // Apply mutation
  const mutatedTraits = mutateTraits(crossedTraits, mutationRate);
  
  // Merge capabilities and tools
  const mergedCapabilities = mergeCapabilities(
    parent1.capabilities,
    parent2.capabilities
  );
  const mergedTools = mergeTools(parent1.toolNames, parent2.toolNames);
  
  // Generate hybrid name
  const hybridName = `${parent1.name}_${parent2.name}_hybrid`;
  
  // Use parent's model (prefer parent1)
  const model = parent1.model;
  
  // Combine instructions
  const hybridInstructions = `
You are a hybrid agent combining:
- ${parent1.name}: ${parent1.instructions.substring(0, 100)}...
- ${parent2.name}: ${parent2.instructions.substring(0, 100)}...

Your inherited traits:
- Creativity: ${mutatedTraits.creativity.toFixed(2)}
- Precision: ${mutatedTraits.precision.toFixed(2)}
- Speed: ${mutatedTraits.speed.toFixed(2)}
- Collaboration: ${mutatedTraits.collaboration.toFixed(2)}

Leverage the strengths of both parent agents to solve complex problems.
  `.trim();
  
  return createDNA(
    hybridName,
    mutatedTraits,
    mergedCapabilities,
    model,
    hybridInstructions,
    mergedTools,
    [parent1.id, parent2.id]
  );
}

/**
 * Calculate genetic distance between two DNA profiles
 * Returns 0-1 (0 = identical, 1 = completely different)
 */
export function geneticDistance(dna1: AgentDNA, dna2: AgentDNA): number {
  const traitDiff = 
    Math.abs(dna1.traits.creativity - dna2.traits.creativity) +
    Math.abs(dna1.traits.precision - dna2.traits.precision) +
    Math.abs(dna1.traits.speed - dna2.traits.speed) +
    Math.abs(dna1.traits.collaboration - dna2.traits.collaboration);
  
  // Normalize to 0-1 range (max possible diff = 4)
  return traitDiff / 4;
}

/**
 * Calculate diversity score for a population
 * Higher = more genetic diversity
 */
export function calculateDiversity(population: AgentDNA[]): number {
  if (population.length < 2) return 0;
  
  let totalDistance = 0;
  let comparisons = 0;
  
  for (let i = 0; i < population.length; i++) {
    for (let j = i + 1; j < population.length; j++) {
      totalDistance += geneticDistance(population[i], population[j]);
      comparisons++;
    }
  }
  
  return comparisons > 0 ? totalDistance / comparisons : 0;
}

/**
 * Select best traits from a recommendation
 * Used when spawning agents from synthesis recommendations
 */
export function traitsFromRecommendation(
  baseTraits: AgentTraits,
  recommendedTraits: Record<string, number>
): AgentTraits {
  return {
    creativity: clampTrait(recommendedTraits.creativity ?? baseTraits.creativity),
    precision: clampTrait(recommendedTraits.precision ?? baseTraits.precision),
    speed: clampTrait(recommendedTraits.speed ?? baseTraits.speed),
    collaboration: clampTrait(recommendedTraits.collaboration ?? baseTraits.collaboration),
  };
}
