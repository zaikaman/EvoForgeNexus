/**
 * Test Battle Runner - Demo the arena system
 */

import { 
  createSpeedDemon, 
  createPerfectionist, 
  createCreative,
  buildADKAgent,
  updateAgentStats
} from './agents/coding/specialized-agents.js';
import { parseProblem, createTestCase } from './core/arena/problem-parser.js';
import { runTests } from './core/arena/test-runner.js';
import { calculateMetrics, rankSubmissions, determineWinner } from './core/arena/judging-system.js';
import type { CodingProblem, Battle, BattleSubmission } from './types/arena.js';

/**
 * Run a test battle between agents
 */
async function runTestBattle() {
  console.log('🏆 AI CODE EVOLUTION ARENA - Test Battle\n');

  // Create test problem
  const problem: CodingProblem = parseProblem({
    title: 'Two Sum',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.',
    difficulty: 'easy',
    examples: [
      {
        input: '[2,7,11,15], 9',
        output: '[0,1]',
        explanation: 'nums[0] + nums[1] = 2 + 7 = 9',
      },
    ],
    testCases: [
      createTestCase('[2,7,11,15], 9', '[0,1]'),
      createTestCase('[3,2,4], 6', '[1,2]'),
      createTestCase('[3,3], 6', '[0,1]'),
    ],
    timeLimit: 3000,
    memoryLimit: 128,
  });

  console.log(`📝 Problem: ${problem.title}`);
  console.log(`   ${problem.description}\n`);

  // Create competing agents
  const speedDemon = createSpeedDemon();
  const perfectionist = createPerfectionist();
  const creative = createCreative();

  const agents = [speedDemon, perfectionist, creative];

  console.log('🤖 Contestants:');
  agents.forEach(agent => {
    console.log(`   ${agent.avatar} ${agent.name} (${agent.personality}) - ELO: ${agent.elo}`);
  });
  console.log();

  // Create battle
  const battle: Battle = {
    id: 'battle-test-1',
    problem_id: problem.id,
    agents: agents.map(a => a.id),
    status: 'in_progress',
    mode: 'versus',
    started_at: Date.now(),
    submissions: [],
    spectators: 0,
  };

  // Each agent attempts to solve
  console.log('⚔️  Battle Starting...\n');

  const submissions: BattleSubmission[] = [];

  for (const agent of agents) {
    console.log(`${agent.avatar} ${agent.name} is coding...`);

    try {
      // Build ADK agent
      const adkAgent = await buildADKAgent(agent, problem.description);
      
      if (!adkAgent.runner) {
        throw new Error('Failed to initialize ADK runner');
      }

      // Get solution from LLM using ask() method
      const response = await adkAgent.runner.ask(`Write a JavaScript function to solve this problem. Only provide the function code, no explanation.`);

      const code = extractCode(typeof response === 'string' ? response : JSON.stringify(response));
      console.log(`   ✓ Solution generated (${code.split('\n').length} lines)`);

      // Run tests
      const execution = await runTests(code, problem.testCases, 'javascript', {
        timeLimit: problem.timeLimit,
        memoryLimit: problem.memoryLimit,
      });

      // Calculate metrics
      const metrics = calculateMetrics(execution, problem, code);

      // Create submission
      const submission: BattleSubmission = {
        id: `sub-${agent.id}`,
        battle_id: battle.id,
        agent_id: agent.id,
        language: 'javascript',
        code,
        submitted_at: Date.now(),
        execution_result: execution,
        metrics,
      };

      submissions.push(submission);

      console.log(`   Tests: ${execution.tests_passed}/${execution.tests_total}`);
      console.log(`   Time: ${execution.execution_time}ms`);
      console.log(`   Score: ${metrics.overall_score.toFixed(1)}/100\n`);

    } catch (error) {
      console.error(`   ✗ Error: ${error instanceof Error ? error.message : String(error)}\n`);
    }
  }

  // Rank submissions
  const ranked = rankSubmissions(submissions);
  battle.submissions = ranked;
  battle.status = 'completed';
  battle.completed_at = Date.now();
  const winnerId = determineWinner(submissions);
  battle.winner_id = winnerId || undefined;

  // Display results
  console.log('🏆 FINAL RESULTS:\n');
  ranked.forEach((sub, idx) => {
    const agent = agents.find(a => a.id === sub.agent_id)!;
    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉';
    
    console.log(`${medal} #${sub.rank} - ${agent.avatar} ${agent.name}`);
    console.log(`   Overall Score: ${sub.metrics.overall_score.toFixed(1)}/100`);
    console.log(`   Tests Passed: ${sub.execution_result.tests_passed}/${sub.execution_result.tests_total}`);
    console.log(`   Time: ${sub.execution_result.execution_time}ms`);
    console.log(`   Elegance: ${sub.metrics.elegance_score.toFixed(1)}/10`);
    console.log();
  });

  const winner = battle.winner_id ? agents.find(a => a.id === battle.winner_id) : undefined;
  if (winner) {
    console.log(`🎉 WINNER: ${winner.avatar} ${winner.name}!`);
    console.log(`   Victory demonstrates the power of ${winner.personality} coding style!\n`);
  }

  // Show code samples
  console.log('📝 CODE SAMPLES:\n');
  ranked.forEach(sub => {
    const agent = agents.find(a => a.id === sub.agent_id)!;
    console.log(`${agent.name}'s Solution:`);
    console.log('─'.repeat(60));
    console.log(sub.code);
    console.log('─'.repeat(60));
    console.log();
  });
}

/**
 * Extract code from LLM response
 */
function extractCode(response: string): string {
  // Remove markdown code blocks
  let code = response.replace(/```(?:javascript|typescript|js|ts)?\n?/g, '');
  code = code.replace(/```\n?/g, '');
  
  // Remove explanations before/after code
  const lines = code.split('\n');
  let startIdx = 0;
  let endIdx = lines.length;
  
  // Find start of function
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('function') || lines[i].includes('=>')) {
      startIdx = i;
      break;
    }
  }
  
  return lines.slice(startIdx, endIdx).join('\n').trim();
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTestBattle().catch(console.error);
}

export { runTestBattle };
