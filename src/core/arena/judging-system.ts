/**
 * Judging System - Score and rank submissions
 */

import type { 
  ExecutionResult, 
  SubmissionMetrics, 
  BattleSubmission,
  CodingProblem 
} from '../../types/arena.js';

/**
 * Calculate submission metrics and overall score
 */
export function calculateMetrics(
  execution: ExecutionResult,
  problem: CodingProblem,
  code: string
): SubmissionMetrics {
  // Test score (0-100)
  const test_score = (execution.tests_passed / execution.tests_total) * 100;

  // Time score (0-100) - faster is better
  const time_score = calculateTimeScore(execution.execution_time, problem.timeLimit);

  // Memory score (0-100) - less memory is better
  const memory_score = calculateMemoryScore(execution.memory_used, problem.memoryLimit);

  // Elegance score (0-10) - code quality
  const elegance_score = calculateEleganceScore(code);

  // Calculate penalties
  const penalties = calculatePenalties(execution, code);

  // Calculate bonuses
  const bonuses = calculateBonuses(execution, code, problem);

  // Overall weighted score
  const base_score = 
    test_score * 0.5 +          // Tests are most important (50%)
    time_score * 0.2 +          // Speed matters (20%)
    memory_score * 0.15 +       // Memory efficiency (15%)
    elegance_score * 10 * 0.15; // Code quality (15%)

  const overall_score = Math.max(0, Math.min(100, base_score + bonuses - penalties));

  return {
    time_score,
    memory_score,
    elegance_score,
    test_score,
    overall_score,
    penalties,
    bonuses,
  };
}

/**
 * Calculate time performance score
 */
function calculateTimeScore(actualTime: number, timeLimit: number): number {
  if (actualTime >= timeLimit) return 0;
  
  // Score decreases linearly from 100 to 0
  const ratio = actualTime / timeLimit;
  return Math.max(0, Math.min(100, (1 - ratio) * 100));
}

/**
 * Calculate memory efficiency score
 */
function calculateMemoryScore(actualMemory: number, memoryLimit: number): number {
  if (actualMemory >= memoryLimit) return 0;
  
  // Score decreases as memory usage increases
  const ratio = actualMemory / memoryLimit;
  return Math.max(0, Math.min(100, (1 - ratio) * 100));
}

/**
 * Calculate code elegance/quality score
 */
function calculateEleganceScore(code: string): number {
  let score = 5; // Start at middle

  // Clean code indicators (positive)
  const goodPatterns = [
    { pattern: /\/\*\*.*?\*\//gs, weight: 0.5, name: 'JSDoc comments' },
    { pattern: /\/\/.*$/gm, weight: 0.3, name: 'inline comments' },
    { pattern: /\bconst\b/g, weight: 0.2, name: 'const usage' },
    { pattern: /\blet\b/g, weight: 0.1, name: 'let usage' },
    { pattern: /=>/g, weight: 0.2, name: 'arrow functions' },
    { pattern: /\.map\(|\.filter\(|\.reduce\(/g, weight: 0.3, name: 'functional methods' },
  ];

  // Code smells (negative)
  const badPatterns = [
    { pattern: /\bvar\b/g, weight: -0.3, name: 'var usage' },
    { pattern: /console\.log/g, weight: -0.2, name: 'console.log' },
    { pattern: /debugger/g, weight: -0.5, name: 'debugger' },
    { pattern: /eval\(/g, weight: -1, name: 'eval' },
    { pattern: /while\(true\)/g, weight: -0.5, name: 'infinite loop' },
    { pattern: /.{200,}/g, weight: -0.2, name: 'very long lines' },
  ];

  // Apply good patterns
  goodPatterns.forEach(({ pattern, weight }) => {
    const matches = code.match(pattern);
    if (matches) {
      score += Math.min(weight * matches.length, 2); // Cap bonus
    }
  });

  // Apply bad patterns
  badPatterns.forEach(({ pattern, weight }) => {
    const matches = code.match(pattern);
    if (matches) {
      score += weight * matches.length; // Negative weight
    }
  });

  // Check code length (conciseness bonus)
  const lines = code.split('\n').length;
  if (lines < 20) score += 0.5;
  if (lines > 100) score -= 0.5;

  // Check indentation consistency
  if (hasConsistentIndentation(code)) score += 0.5;

  return Math.max(0, Math.min(10, score));
}

/**
 * Check for consistent indentation
 */
function hasConsistentIndentation(code: string): boolean {
  const lines = code.split('\n');
  const indents = lines
    .filter(line => line.trim().length > 0)
    .map(line => line.match(/^\s*/)?.[0].length || 0);

  if (indents.length < 2) return true;

  // Check if indents are multiples of 2 or 4
  const is2Spaces = indents.every(indent => indent % 2 === 0);
  const is4Spaces = indents.every(indent => indent % 4 === 0);

  return is2Spaces || is4Spaces;
}

/**
 * Calculate penalties for various issues
 */
function calculatePenalties(execution: ExecutionResult, code: string): number {
  let penalties = 0;

  // Failed tests penalty
  const failedTests = execution.tests_total - execution.tests_passed;
  penalties += failedTests * 5; // 5 points per failed test

  // Runtime error penalty
  if (execution.status === 'runtime_error') {
    penalties += 20;
  }

  // Compilation error penalty
  if (execution.status === 'compilation_error') {
    penalties += 25;
  }

  // Time limit exceeded penalty
  if (execution.status === 'time_limit_exceeded') {
    penalties += 30;
  }

  // Memory limit exceeded penalty
  if (execution.status === 'memory_limit_exceeded') {
    penalties += 25;
  }

  // Code quality penalties
  if (code.includes('TODO') || code.includes('FIXME')) {
    penalties += 5;
  }

  return penalties;
}

/**
 * Calculate bonuses for excellence
 */
function calculateBonuses(
  execution: ExecutionResult,
  code: string,
  problem: CodingProblem
): number {
  let bonuses = 0;

  // Perfect score bonus
  if (execution.tests_passed === execution.tests_total) {
    bonuses += 10;
  }

  // Speed demon bonus (completed in < 10% of time limit)
  if (execution.execution_time < problem.timeLimit * 0.1) {
    bonuses += 5;
  }

  // Memory efficient bonus (used < 10% of memory limit)
  if (execution.memory_used < problem.memoryLimit * 0.1) {
    bonuses += 5;
  }

  // Concise code bonus (< 15 lines)
  if (code.split('\n').length < 15) {
    bonuses += 3;
  }

  // Documentation bonus
  if (code.includes('/**') || code.split('\n').filter(l => l.trim().startsWith('//')).length > 2) {
    bonuses += 2;
  }

  return bonuses;
}

/**
 * Rank submissions in a battle
 */
export function rankSubmissions(submissions: BattleSubmission[]): BattleSubmission[] {
  // Sort by overall score (descending)
  const ranked = [...submissions].sort((a, b) => {
    // First by overall score
    if (b.metrics.overall_score !== a.metrics.overall_score) {
      return b.metrics.overall_score - a.metrics.overall_score;
    }

    // Then by test score
    if (b.metrics.test_score !== a.metrics.test_score) {
      return b.metrics.test_score - a.metrics.test_score;
    }

    // Then by time
    if (a.execution_result.execution_time !== b.execution_result.execution_time) {
      return a.execution_result.execution_time - b.execution_result.execution_time;
    }

    // Finally by submission time (earlier is better)
    return a.submitted_at - b.submitted_at;
  });

  // Assign ranks
  ranked.forEach((submission, index) => {
    submission.rank = index + 1;
  });

  return ranked;
}

/**
 * Determine winner of a battle
 */
export function determineWinner(submissions: BattleSubmission[]): string | null {
  if (submissions.length === 0) return null;

  const ranked = rankSubmissions(submissions);
  return ranked[0].agent_id;
}

/**
 * Calculate ELO rating change
 */
export function calculateEloChange(
  winnerElo: number,
  loserElo: number,
  k: number = 32
): { winnerDelta: number; loserDelta: number } {
  // Expected scores
  const expectedWinner = 1 / (1 + Math.pow(10, (loserElo - winnerElo) / 400));
  const expectedLoser = 1 / (1 + Math.pow(10, (winnerElo - loserElo) / 400));

  // Actual scores (winner gets 1, loser gets 0)
  const actualWinner = 1;
  const actualLoser = 0;

  // Calculate changes
  const winnerDelta = Math.round(k * (actualWinner - expectedWinner));
  const loserDelta = Math.round(k * (actualLoser - expectedLoser));

  return { winnerDelta, loserDelta };
}

/**
 * Calculate ELO for draw/multi-way battle
 */
export function calculateMultiWayElo(
  rankings: { agent_id: string; elo: number; rank: number }[],
  k: number = 32
): Record<string, number> {
  const n = rankings.length;
  const changes: Record<string, number> = {};

  // For each pair of agents
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const agent1 = rankings[i];
      const agent2 = rankings[j];

      // Determine score (1 if better rank, 0.5 if tie, 0 if worse)
      let score1: number, score2: number;
      if (agent1.rank < agent2.rank) {
        score1 = 1;
        score2 = 0;
      } else if (agent1.rank > agent2.rank) {
        score1 = 0;
        score2 = 1;
      } else {
        score1 = 0.5;
        score2 = 0.5;
      }

      // Expected scores
      const expected1 = 1 / (1 + Math.pow(10, (agent2.elo - agent1.elo) / 400));
      const expected2 = 1 / (1 + Math.pow(10, (agent1.elo - agent2.elo) / 400));

      // Calculate changes
      changes[agent1.agent_id] = (changes[agent1.agent_id] || 0) + k * (score1 - expected1);
      changes[agent2.agent_id] = (changes[agent2.agent_id] || 0) + k * (score2 - expected2);
    }
  }

  // Round changes
  Object.keys(changes).forEach(id => {
    changes[id] = Math.round(changes[id]);
  });

  return changes;
}
