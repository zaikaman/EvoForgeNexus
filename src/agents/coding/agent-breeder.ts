/**
 * Agent Breeder - Evolutionary breeding system
 */

import type { CodingAgent, CodingAgentDNA, BreedingRequest, BreedingResult } from '../../types/arena.js';
import { createCodingAgent } from './specialized-agents.js';

/**
 * Breed two agents to create hybrid offspring
 */
export function breedAgents(
  parent1: CodingAgent,
  parent2: CodingAgent,
  request: Partial<BreedingRequest> = {}
): BreedingResult {
  const mutationRate = request.mutation_rate || 0.1;
  const traitWeights = request.trait_weights || {};

  // Calculate contribution percentages (based on ELO)
  const totalElo = parent1.elo + parent2.elo;
  const parent1Contribution = parent1.elo / totalElo;
  const parent2Contribution = parent2.elo / totalElo;

  // Blend DNA traits
  const childDNA: CodingAgentDNA = {
    traits: blendTraits(parent1.dna.traits, parent2.dna.traits, parent1Contribution, traitWeights),
    preferred_patterns: [
      ...parent1.dna.preferred_patterns,
      ...parent2.dna.preferred_patterns,
    ].filter((v, i, a) => a.indexOf(v) === i), // Unique patterns
    language_proficiency: blendLanguageProficiency(
      parent1.dna.language_proficiency,
      parent2.dna.language_proficiency,
      parent1Contribution
    ),
    model: parent1.elo > parent2.elo ? parent1.dna.model : parent2.dna.model,
    prompt_template: blendPrompts(parent1.dna.prompt_template, parent2.dna.prompt_template),
    temperature: (parent1.dna.temperature + parent2.dna.temperature) / 2,
  };

  // Apply mutations
  const mutations = applyMutations(childDNA, mutationRate);

  // Generate child name
  const childName = request.name || generateHybridName(parent1.name, parent2.name);

  // Create child agent
  const child = createCodingAgent(childName, 'hybrid', childDNA, {
    parentIds: [parent1.id, parent2.id],
  });

  // Predict strength based on parent performance
  const predictedStrength = (parent1.stats.win_rate + parent2.stats.win_rate) / 2 + 
    (mutations.length * 0.05); // Bonus for genetic diversity

  return {
    child,
    parent1_contribution: parent1Contribution,
    parent2_contribution: parent2Contribution,
    mutations,
    predicted_strength: Math.min(1, predictedStrength),
  };
}

/**
 * Blend trait values from two parents
 */
function blendTraits(
  traits1: CodingAgentDNA['traits'],
  traits2: CodingAgentDNA['traits'],
  parent1Weight: number,
  customWeights: Partial<Record<keyof CodingAgentDNA['traits'], number>>
): CodingAgentDNA['traits'] {
  const result: CodingAgentDNA['traits'] = {
    speed: 0,
    code_quality: 0,
    creativity: 0,
    optimization: 0,
    readability: 0,
    debugging: 0,
  };

  // Blend each trait
  Object.keys(result).forEach(key => {
    const traitKey = key as keyof CodingAgentDNA['traits'];
    const weight = customWeights[traitKey] ?? parent1Weight;
    
    result[traitKey] = traits1[traitKey] * weight + traits2[traitKey] * (1 - weight);
    
    // Ensure 0-1 range
    result[traitKey] = Math.max(0, Math.min(1, result[traitKey]));
  });

  return result;
}

/**
 * Blend language proficiencies
 */
function blendLanguageProficiency(
  prof1: Record<string, number>,
  prof2: Record<string, number>,
  parent1Weight: number
): Record<string, number> {
  const result: Record<string, number> = {};
  
  // Get all languages
  const allLanguages = new Set([...Object.keys(prof1), ...Object.keys(prof2)]);
  
  allLanguages.forEach(lang => {
    const p1 = prof1[lang] || 0;
    const p2 = prof2[lang] || 0;
    result[lang] = p1 * parent1Weight + p2 * (1 - parent1Weight);
  });
  
  return result;
}

/**
 * Blend system prompts
 */
function blendPrompts(prompt1: string, prompt2: string): string {
  // Extract key characteristics from each prompt
  const lines1 = prompt1.split('\n').filter(l => l.includes('-'));
  const lines2 = prompt2.split('\n').filter(l => l.includes('-'));
  
  // Combine characteristics
  const combined = [...lines1.slice(0, 3), ...lines2.slice(0, 2)];
  
  return `You are a Hybrid Agent, combining the best traits of your parents.
Your approach balances multiple priorities:
${combined.join('\n')}

Adapt your strategy based on the problem at hand.`;
}

/**
 * Apply random mutations to DNA
 */
function applyMutations(dna: CodingAgentDNA, mutationRate: number): string[] {
  const mutations: string[] = [];

  // Trait mutations
  Object.keys(dna.traits).forEach(key => {
    if (Math.random() < mutationRate) {
      const traitKey = key as keyof CodingAgentDNA['traits'];
      const delta = (Math.random() - 0.5) * 0.2; // ±10%
      const oldValue = dna.traits[traitKey];
      dna.traits[traitKey] = Math.max(0, Math.min(1, oldValue + delta));
      
      mutations.push(
        `${traitKey}: ${oldValue.toFixed(2)} → ${dna.traits[traitKey].toFixed(2)}`
      );
    }
  });

  // Temperature mutation
  if (Math.random() < mutationRate) {
    const delta = (Math.random() - 0.5) * 0.2;
    const oldTemp = dna.temperature;
    dna.temperature = Math.max(0, Math.min(2, oldTemp + delta));
    mutations.push(`temperature: ${oldTemp.toFixed(2)} → ${dna.temperature.toFixed(2)}`);
  }

  // Language proficiency mutation
  if (Math.random() < mutationRate) {
    const languages = Object.keys(dna.language_proficiency);
    const randomLang = languages[Math.floor(Math.random() * languages.length)];
    const delta = (Math.random() - 0.5) * 0.1;
    const oldProf = dna.language_proficiency[randomLang];
    dna.language_proficiency[randomLang] = Math.max(0, Math.min(1, oldProf + delta));
    mutations.push(
      `${randomLang} proficiency: ${oldProf.toFixed(2)} → ${dna.language_proficiency[randomLang].toFixed(2)}`
    );
  }

  return mutations;
}

/**
 * Generate hybrid name from parent names
 */
function generateHybridName(name1: string, name2: string): string {
  // Extract key words
  const words1 = name1.split(' ');
  const words2 = name2.split(' ');
  
  // Try to create portmanteau
  if (words1.length === 1 && words2.length === 1) {
    const mid1 = Math.floor(name1.length / 2);
    const mid2 = Math.floor(name2.length / 2);
    return name1.slice(0, mid1) + name2.slice(mid2);
  }
  
  // Otherwise combine words
  const firstWord = Math.random() > 0.5 ? words1[0] : words2[0];
  const lastWord = Math.random() > 0.5 
    ? words1[words1.length - 1] 
    : words2[words2.length - 1];
  
  return `${firstWord} ${lastWord}`;
}

/**
 * Calculate genetic distance between two agents
 */
export function geneticDistance(agent1: CodingAgent, agent2: CodingAgent): number {
  const dna1 = agent1.dna.traits;
  const dna2 = agent2.dna.traits;
  
  let totalDistance = 0;
  let count = 0;
  
  // Calculate Euclidean distance in trait space
  Object.keys(dna1).forEach(key => {
    const traitKey = key as keyof CodingAgentDNA['traits'];
    totalDistance += Math.pow(dna1[traitKey] - dna2[traitKey], 2);
    count++;
  });
  
  return Math.sqrt(totalDistance / count);
}

/**
 * Suggest breeding pairs based on performance and diversity
 */
export function suggestBreedingPairs(
  agents: CodingAgent[],
  count: number = 3
): Array<[CodingAgent, CodingAgent]> {
  const pairs: Array<[CodingAgent, CodingAgent]> = [];
  
  // Sort by performance
  const sorted = [...agents].sort((a, b) => b.elo - a.elo);
  
  // Take top performers
  const topAgents = sorted.slice(0, Math.min(10, sorted.length));
  
  // Find diverse pairs
  for (let i = 0; i < topAgents.length && pairs.length < count; i++) {
    for (let j = i + 1; j < topAgents.length && pairs.length < count; j++) {
      const agent1 = topAgents[i];
      const agent2 = topAgents[j];
      
      // Prefer genetically diverse pairs
      const distance = geneticDistance(agent1, agent2);
      
      if (distance > 0.3) { // Threshold for diversity
        pairs.push([agent1, agent2]);
      }
    }
  }
  
  return pairs;
}

/**
 * Build family tree for agent
 */
export function buildFamilyTree(
  agent: CodingAgent,
  allAgents: Map<string, CodingAgent>,
  depth: number = 3
): any {
  if (depth === 0 || !agent.parentIds || agent.parentIds.length === 0) {
    return {
      id: agent.id,
      name: agent.name,
      elo: agent.elo,
      generation: agent.generation,
      personality: agent.personality,
    };
  }
  
  const parents = agent.parentIds
    .map(id => allAgents.get(id))
    .filter((p): p is CodingAgent => p !== undefined)
    .map(parent => buildFamilyTree(parent, allAgents, depth - 1));
  
  return {
    id: agent.id,
    name: agent.name,
    elo: agent.elo,
    generation: agent.generation,
    personality: agent.personality,
    parents,
  };
}
