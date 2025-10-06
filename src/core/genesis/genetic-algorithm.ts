/**
 * Genetic Algorithm - Agent Evolution & Selection
 * Implements fitness-based selection and evolutionary optimization
 */

import type { AgentDNA, AgentGenome } from '../../types/index.js';
import { geneticDistance } from './dna.js';
import { spawnHybrid } from './spawner.js';

/**
 * Calculate fitness score for an agent based on performance
 * Combines multiple metrics into single 0-1 score
 */
export function calculateFitness(genome: AgentGenome): number {
  const metrics = genome.performanceMetrics;
  
  // Weighted fitness calculation
  const fitness = 
    metrics.averageQuality * 0.4 +      // Quality most important
    metrics.successRate * 0.3 +         // Success rate critical
    metrics.collaborationScore * 0.2 +  // Teamwork matters
    (1 - metrics.averageSpeed / 10000) * 0.1; // Speed bonus (normalized)
  
  return Math.max(0, Math.min(1, fitness));
}

/**
 * Tournament selection - pick best from random subset
 * More fit agents have higher chance of selection
 */
export function tournamentSelection(
  population: AgentGenome[],
  tournamentSize: number = 3
): AgentGenome {
  if (population.length === 0) {
    throw new Error('Cannot select from empty population');
  }

  // Pick random contestants
  const contestants: AgentGenome[] = [];
  for (let i = 0; i < Math.min(tournamentSize, population.length); i++) {
    const randomIdx = Math.floor(Math.random() * population.length);
    contestants.push(population[randomIdx]);
  }

  // Return fittest contestant
  return contestants.reduce((best, current) => 
    current.fitnessScore > best.fitnessScore ? current : best
  );
}

/**
 * Roulette wheel selection - probability proportional to fitness
 */
export function rouletteSelection(population: AgentGenome[]): AgentGenome {
  if (population.length === 0) {
    throw new Error('Cannot select from empty population');
  }

  const totalFitness = population.reduce((sum, agent) => sum + agent.fitnessScore, 0);
  
  if (totalFitness === 0) {
    // Random selection if all fitness is 0
    return population[Math.floor(Math.random() * population.length)];
  }

  let random = Math.random() * totalFitness;
  
  for (const agent of population) {
    random -= agent.fitnessScore;
    if (random <= 0) {
      return agent;
    }
  }

  // Fallback
  return population[population.length - 1];
}

/**
 * Rank-based selection - selection based on ranking, not raw fitness
 * Prevents premature convergence when fitness differences are large
 */
export function rankSelection(population: AgentGenome[]): AgentGenome {
  if (population.length === 0) {
    throw new Error('Cannot select from empty population');
  }

  // Sort by fitness (ascending)
  const sorted = [...population].sort((a, b) => a.fitnessScore - b.fitnessScore);
  
  // Assign selection probabilities based on rank
  const n = sorted.length;
  const totalRank = (n * (n + 1)) / 2; // Sum of 1 to n
  
  let random = Math.random() * totalRank;
  
  for (let i = 0; i < sorted.length; i++) {
    const rank = i + 1; // Rank from 1 to n
    random -= rank;
    if (random <= 0) {
      return sorted[i];
    }
  }

  return sorted[sorted.length - 1];
}

/**
 * Elitism - preserve top N agents to next generation
 */
export function selectElite(
  population: AgentGenome[],
  eliteCount: number
): AgentGenome[] {
  return [...population]
    .sort((a, b) => b.fitnessScore - a.fitnessScore)
    .slice(0, eliteCount);
}

/**
 * Diversity-based selection - prefer agents that are genetically different
 * Maintains genetic diversity in population
 */
export function diversitySelection(
  population: AgentGenome[],
  referencePopulation: AgentGenome[]
): AgentGenome {
  if (population.length === 0) {
    throw new Error('Cannot select from empty population');
  }

  // Calculate average diversity for each candidate
  const diversityScores = population.map(candidate => {
    const distances = referencePopulation.map(ref => 
      geneticDistance(candidate, ref)
    );
    return {
      agent: candidate,
      avgDiversity: distances.reduce((sum, d) => sum + d, 0) / distances.length,
    };
  });

  // Select most diverse
  return diversityScores.reduce((best, current) =>
    current.avgDiversity > best.avgDiversity ? current : best
  ).agent;
}

/**
 * Run genetic algorithm for N generations
 * Returns evolved population
 */
export function evolvePopulation(
  initialPopulation: AgentGenome[],
  generations: number,
  populationSize: number,
  eliteCount: number = 2,
  mutationRate: number = 0.3,
  selectionMethod: 'tournament' | 'roulette' | 'rank' = 'tournament'
): AgentGenome[] {
  let population = [...initialPopulation];

  for (let gen = 0; gen < generations; gen++) {
    // Calculate fitness for all agents
    population.forEach(agent => {
      agent.fitnessScore = calculateFitness(agent);
    });

    // Preserve elite
    const elite = selectElite(population, eliteCount);

    // Generate offspring
    const offspring: AgentDNA[] = [];
    const targetOffspringCount = populationSize - elite.length;

    for (let i = 0; i < targetOffspringCount; i++) {
      // Select parents
      let parent1: AgentGenome;
      let parent2: AgentGenome;

      switch (selectionMethod) {
        case 'tournament':
          parent1 = tournamentSelection(population);
          parent2 = tournamentSelection(population);
          break;
        case 'roulette':
          parent1 = rouletteSelection(population);
          parent2 = rouletteSelection(population);
          break;
        case 'rank':
          parent1 = rankSelection(population);
          parent2 = rankSelection(population);
          break;
      }

      // Breed
      const child = spawnHybrid(parent1, parent2, mutationRate);
      offspring.push(child);
    }

    // Convert offspring to genomes
    const offspringGenomes: AgentGenome[] = offspring.map(dna => ({
      ...dna,
      fitnessScore: 0,
      performanceMetrics: {
        tasksCompleted: 0,
        averageQuality: 0,
        averageSpeed: 0,
        successRate: 0,
        collaborationScore: 0,
      },
      offspring: [],
      status: 'active' as const,
    }));

    // New population = elite + offspring
    population = [...elite, ...offspringGenomes];
  }

  return population;
}

/**
 * Check convergence - has population stopped improving?
 */
export function checkConvergence(
  population: AgentGenome[],
  threshold: number = 0.05
): boolean {
  if (population.length < 2) return false;

  const fitnesses = population.map(a => a.fitnessScore);
  const avgFitness = fitnesses.reduce((sum, f) => sum + f, 0) / fitnesses.length;
  
  // Calculate standard deviation
  const variance = fitnesses.reduce((sum, f) => sum + Math.pow(f - avgFitness, 2), 0) / fitnesses.length;
  const stdDev = Math.sqrt(variance);

  // Converged if very low variance
  return stdDev < threshold;
}

/**
 * Get population statistics
 */
export function getPopulationStats(population: AgentGenome[]) {
  if (population.length === 0) {
    return {
      avgFitness: 0,
      maxFitness: 0,
      minFitness: 0,
      stdDev: 0,
      diversity: 0,
    };
  }

  const fitnesses = population.map(a => a.fitnessScore);
  const avgFitness = fitnesses.reduce((sum, f) => sum + f, 0) / fitnesses.length;
  const maxFitness = Math.max(...fitnesses);
  const minFitness = Math.min(...fitnesses);
  
  const variance = fitnesses.reduce((sum, f) => sum + Math.pow(f - avgFitness, 2), 0) / fitnesses.length;
  const stdDev = Math.sqrt(variance);

  // Calculate genetic diversity
  let totalDistance = 0;
  let comparisons = 0;
  for (let i = 0; i < population.length; i++) {
    for (let j = i + 1; j < population.length; j++) {
      totalDistance += geneticDistance(population[i], population[j]);
      comparisons++;
    }
  }
  const diversity = comparisons > 0 ? totalDistance / comparisons : 0;

  return {
    avgFitness,
    maxFitness,
    minFitness,
    stdDev,
    diversity,
  };
}
