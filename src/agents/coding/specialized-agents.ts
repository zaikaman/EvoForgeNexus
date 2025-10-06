/**
 * Coding Agents - Specialized AI for competitive programming
 */

import { AgentBuilder } from '@iqai/adk';
import type { CodingAgent, CodingAgentDNA, AgentPersonality } from '../../types/arena.js';

/**
 * Base Coding Agent Factory
 */
export function createCodingAgent(
  name: string,
  personality: AgentPersonality,
  dna: Partial<CodingAgentDNA> = {},
  options: {
    ownerId?: string;
    parentIds?: string[];
  } = {}
): CodingAgent {
  const fullDNA = getDefaultDNA(personality, dna);

  return {
    id: generateAgentId(name),
    name,
    personality,
    dna: fullDNA,
    stats: {
      battles_fought: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      win_rate: 0,
      problems_solved: 0,
      average_time: 0,
      average_memory: 0,
      test_pass_rate: 0,
      elegance_score: 0,
      best_streak: 0,
      current_streak: 0,
    },
    elo: 1200, // Starting ELO
    rank: 'Bronze',
    avatar: getPersonalityAvatar(personality),
    parentIds: options.parentIds,
    generation: options.parentIds ? 1 : 0,
    created_at: Date.now(),
    owner_id: options.ownerId,
  };
}

/**
 * Speed Demon Agent - Fast but may sacrifice quality
 */
export function createSpeedDemon(options?: { ownerId?: string }): CodingAgent {
  return createCodingAgent('Speed Demon', 'speed_demon', {
    traits: {
      speed: 0.95,           // Very fast
      code_quality: 0.4,     // Lower quality
      creativity: 0.6,       // Moderate creativity
      optimization: 0.5,     // Less focus on optimization
      readability: 0.3,      // Lower readability
      debugging: 0.5,        // Moderate debugging
    },
    temperature: 0.9,        // Higher randomness for speed
  }, options);
}

/**
 * Perfectionist Agent - Slow but produces clean code
 */
export function createPerfectionist(options?: { ownerId?: string }): CodingAgent {
  return createCodingAgent('Perfectionist', 'perfectionist', {
    traits: {
      speed: 0.3,            // Slower
      code_quality: 0.95,    // Excellent quality
      creativity: 0.5,       // Standard approaches
      optimization: 0.8,     // Good optimization
      readability: 0.95,     // Highly readable
      debugging: 0.9,        // Great debugging
    },
    temperature: 0.3,        // Lower randomness for consistency
  }, options);
}

/**
 * Creative Agent - Unique approaches
 */
export function createCreative(options?: { ownerId?: string }): CodingAgent {
  return createCodingAgent('Creative Genius', 'creative', {
    traits: {
      speed: 0.6,            // Moderate speed
      code_quality: 0.7,     // Good quality
      creativity: 0.98,      // Extremely creative
      optimization: 0.6,     // Moderate optimization
      readability: 0.6,      // Moderate readability
      debugging: 0.6,        // Moderate debugging
    },
    temperature: 1.0,        // Maximum creativity
  }, options);
}

/**
 * Optimizer Agent - Performance focused
 */
export function createOptimizer(options?: { ownerId?: string }): CodingAgent {
  return createCodingAgent('Optimizer', 'optimizer', {
    traits: {
      speed: 0.5,            // Moderate speed
      code_quality: 0.7,     // Good quality
      creativity: 0.5,       // Standard creativity
      optimization: 0.98,    // Extreme optimization
      readability: 0.6,      // Moderate readability
      debugging: 0.8,        // Good debugging
    },
    temperature: 0.5,        // Balanced
  }, options);
}

/**
 * Readable Agent - Best practices & maintainability
 */
export function createReadable(options?: { ownerId?: string }): CodingAgent {
  return createCodingAgent('Code Poet', 'readable', {
    traits: {
      speed: 0.5,            // Moderate speed
      code_quality: 0.9,     // Excellent quality
      creativity: 0.6,       // Moderate creativity
      optimization: 0.7,     // Good optimization
      readability: 0.98,     // Maximum readability
      debugging: 0.8,        // Good debugging
    },
    temperature: 0.4,        // Lower for consistency
  }, options);
}

/**
 * Get default DNA for personality type
 */
function getDefaultDNA(
  personality: AgentPersonality,
  overrides: Partial<CodingAgentDNA> = {}
): CodingAgentDNA {
  const defaults: CodingAgentDNA = {
    traits: {
      speed: 0.5,
      code_quality: 0.5,
      creativity: 0.5,
      optimization: 0.5,
      readability: 0.5,
      debugging: 0.5,
    },
    preferred_patterns: [],
    language_proficiency: {
      javascript: 0.8,
      typescript: 0.8,
      python: 0.7,
    },
    model: 'gemini-2.0-flash-exp',
    prompt_template: getPromptTemplate(personality),
    temperature: 0.7,
  };

  return {
    ...defaults,
    ...overrides,
    traits: {
      ...defaults.traits,
      ...overrides.traits,
    },
  };
}

/**
 * Get system prompt template for personality
 */
function getPromptTemplate(personality: AgentPersonality): string {
  const templates: Record<AgentPersonality, string> = {
    speed_demon: `You are Speed Demon, a competitive coding AI focused on solving problems FAST.
Priority: Speed > Correctness > Elegance
- Write code quickly, optimize later
- Use simple, direct approaches
- Don't overthink edge cases
- Get tests passing as fast as possible
- Comments are optional if they slow you down`,

    perfectionist: `You are Perfectionist, a coding AI that values quality above all.
Priority: Quality > Correctness > Speed
- Write clean, maintainable code
- Follow best practices strictly
- Add comprehensive comments
- Handle all edge cases
- Prefer readability over cleverness
- Optimize for long-term maintenance`,

    creative: `You are Creative Genius, an AI that finds unique solutions.
Priority: Uniqueness > Correctness > Speed
- Think outside the box
- Use unusual approaches
- Combine unexpected patterns
- Prefer elegant over obvious
- Make reviewers say "wow, I didn't think of that"
- Be bold with your solutions`,

    optimizer: `You are Optimizer, a performance-obsessed coding AI.
Priority: Performance > Correctness > Readability
- Minimize time complexity
- Reduce memory usage
- Use optimal data structures
- Eliminate redundant operations
- Profile and benchmark mentally
- Sacrifice readability for speed if needed`,

    readable: `You are Code Poet, a coding AI that writes beautiful code.
Priority: Readability > Correctness > Speed
- Code should read like prose
- Use descriptive variable names
- Add explanatory comments
- Follow style guides religiously
- Make code self-documenting
- Think: "Will a junior dev understand this?"`,

    hybrid: `You are a Hybrid Agent with balanced traits.
Balance all priorities: Speed, Quality, Performance, Creativity.
Adapt your approach based on problem requirements.`,
  };

  return templates[personality] || templates.hybrid;
}

/**
 * Get avatar for personality
 */
function getPersonalityAvatar(personality: AgentPersonality): string {
  const avatars: Record<AgentPersonality, string> = {
    speed_demon: '⚡',
    perfectionist: '💎',
    creative: '🎨',
    optimizer: '🚀',
    readable: '📖',
    hybrid: '🧬',
  };

  return avatars[personality];
}

/**
 * Generate unique agent ID
 */
function generateAgentId(name: string): string {
  const prefix = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  
  return `${prefix}-${timestamp}-${random}`;
}

/**
 * Build ADK Agent from CodingAgent config
 */
export async function buildADKAgent(codingAgent: CodingAgent, problem: string) {
  const systemPrompt = `${codingAgent.dna.prompt_template}

PROBLEM:
${problem}

REQUIREMENTS:
- Write a function called 'solve' that takes the problem input as parameters
- Return the solution directly (will be compared against expected output)
- Focus on correctness first
- Your personality traits affect your coding style:
  Speed: ${codingAgent.dna.traits.speed.toFixed(2)}
  Quality: ${codingAgent.dna.traits.code_quality.toFixed(2)}
  Creativity: ${codingAgent.dna.traits.creativity.toFixed(2)}
  Optimization: ${codingAgent.dna.traits.optimization.toFixed(2)}
  Readability: ${codingAgent.dna.traits.readability.toFixed(2)}

Write your solution now:`;

  const { agent, runner } = await AgentBuilder
    .withModel(codingAgent.dna.model)
    .withInstruction(systemPrompt)
    .build();

  return { agent, runner };
}

/**
 * Update agent stats after battle
 */
export function updateAgentStats(
  agent: CodingAgent,
  result: {
    won: boolean;
    time: number;
    memory: number;
    tests_passed: number;
    tests_total: number;
    elegance: number;
  }
): CodingAgent {
  const stats = { ...agent.stats };

  stats.battles_fought++;
  
  if (result.won) {
    stats.wins++;
    stats.current_streak++;
    stats.best_streak = Math.max(stats.best_streak, stats.current_streak);
  } else {
    stats.losses++;
    stats.current_streak = 0;
  }

  if (result.tests_passed === result.tests_total) {
    stats.problems_solved++;
  }

  // Update running averages
  const totalBattles = stats.battles_fought;
  stats.average_time = (stats.average_time * (totalBattles - 1) + result.time) / totalBattles;
  stats.average_memory = (stats.average_memory * (totalBattles - 1) + result.memory) / totalBattles;
  stats.test_pass_rate = (stats.test_pass_rate * (totalBattles - 1) + (result.tests_passed / result.tests_total)) / totalBattles;
  stats.elegance_score = (stats.elegance_score * (totalBattles - 1) + result.elegance) / totalBattles;
  
  stats.win_rate = stats.wins / stats.battles_fought;

  return {
    ...agent,
    stats,
  };
}
