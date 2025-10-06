/**
 * Real Battle Executor with ADK-TS Framework
 * Uses ADK agents with Google Gemini API
 */

import { getProblemsByDifficulty } from '../../../../src/data/problems-database.js';
import { runTests } from '../../../../src/core/arena/test-runner.js';
import { 
  createCodingAgent,
  buildADKAgent 
} from '../../../../src/agents/coding/specialized-agents.js';
import { broadcast } from '../index.js';
import type { CodingAgent } from '../../../../src/types/arena.js';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Map frontend agent IDs to personality types
const PERSONALITY_MAP: Record<string, { personality: any; speedMultiplier: number }> = {
  'speed-demon': { 
    personality: 'speed_demon',
    speedMultiplier: 0.5 
  },
  'perfectionist': { 
    personality: 'perfectionist',
    speedMultiplier: 2.0 
  },
  'creative-genius': { 
    personality: 'creative',
    speedMultiplier: 1.5 
  },
  'optimizer': { 
    personality: 'optimizer',
    speedMultiplier: 1.2 
  },
  'code-poet': { 
    personality: 'readable',
    speedMultiplier: 1.8 
  },
};

export async function executeRealBattle(
  battleId: string,
  problemId: string,
  agentIds: string[]
): Promise<void> {
  try {
    broadcast({
      type: 'battle_start',
      data: { battleId, problemId, agentIds, timestamp: Date.now() },
    });

    // Load problem
    const allProblems = [
      ...getProblemsByDifficulty('easy'),
      ...getProblemsByDifficulty('medium'),
      ...getProblemsByDifficulty('hard'),
    ];
    const problem = allProblems.find(p => p.id === problemId);

    if (!problem) {
      throw new Error(`Problem ${problemId} not found`);
    }

    broadcast({
      type: 'problem_loaded',
      data: { problem },
    });

    // Initialize ADK agents
    const agents: Array<{ 
      codingAgent: CodingAgent; 
      adkRunner: any; 
      speedMultiplier: number;
      agentId: string; 
    }> = [];
    
    for (const agentId of agentIds) {
      try {
        const mapping = PERSONALITY_MAP[agentId] || PERSONALITY_MAP['speed-demon'];
        
        // Create CodingAgent with personality traits and gpt-5-nano model
        const codingAgent = createCodingAgent(
          agentId,
          mapping.personality,
          { model: 'gpt-5-nano' }
        );
        
        // Build ADK agent from CodingAgent
        const { runner: adkRunner } = await buildADKAgent(codingAgent, problem.description);
        
        agents.push({
          codingAgent,
          adkRunner,
          speedMultiplier: mapping.speedMultiplier,
          agentId,
        });

        broadcast({
          type: 'agent_initialized',
          data: { 
            agentId, 
            name: codingAgent.name, 
            emoji: codingAgent.avatar 
          },
        });
        await delay(300);
      } catch (error) {
        console.error(`[Agent ${agentId}] Initialization error:`, error);
      }
    }

    if (agents.length === 0) {
      throw new Error('No agents could be initialized');
    }

    // Execute agents in parallel
    const submissions = await Promise.all(
      agents.map(agent => executeAgent(agent, problem, battleId))
    );

    // Filter out failed submissions
    const validSubmissions = submissions.filter(s => s !== null);

    if (validSubmissions.length === 0) {
      throw new Error('All agents failed to generate solutions');
    }

    // Rank submissions
    validSubmissions.sort((a, b) => b.score - a.score);
    validSubmissions.forEach((sub, idx) => {
      sub.rank = idx + 1;
    });

    const winnerId = validSubmissions[0].agent_id;

    broadcast({
      type: 'battle_complete',
      data: {
        battleId,
        winnerId,
        submissions: validSubmissions,
        timestamp: Date.now(),
      },
    });

  } catch (error: any) {
    console.error(`[Battle ${battleId}] Error:`, error);
    broadcast({
      type: 'battle_error',
      data: { battleId, error: error.message },
    });
  }
}

async function executeAgent(
  agentWrapper: { 
    codingAgent: CodingAgent; 
    adkRunner: any; 
    speedMultiplier: number;
    agentId: string;
  },
  problem: any,
  battleId: string
): Promise<any> {
  const { codingAgent, adkRunner, speedMultiplier, agentId } = agentWrapper;

  try {
    // Thinking phase
    broadcast({
      type: 'agent_status',
      data: { agentId, status: 'thinking' },
    });
    await delay(500 + Math.random() * 500);

    // Coding phase
    broadcast({
      type: 'agent_status',
      data: { agentId, status: 'coding' },
    });

    // Generate code using ADK agent
    const code = await generateCodeWithADK(adkRunner, problem);

    // Stream code typing effect
    const codeLength = code.length;
    const chunks = Math.ceil(codeLength / 50);
    const typingSpeed = speedMultiplier;

    for (let i = 0; i <= chunks; i++) {
      const chunk = code.slice(0, Math.min((i + 1) * 50, codeLength));
      broadcast({
        type: 'code_update',
        data: {
          agentId,
          code: chunk,
          progress: (chunk.length / codeLength) * 100,
        },
      });
      await delay(100 * typingSpeed);
    }

    await delay(500);

    // Testing phase
    broadcast({
      type: 'agent_status',
      data: { agentId, status: 'testing' },
    });
    await delay(800);

    // Run actual tests
    const testResults = await runTests(code, problem.testCases, 'javascript', {
      timeLimit: problem.timeLimit,
      memoryLimit: problem.memoryLimit,
    });

    const testsPassed = testResults.tests_passed;
    const testsTotal = testResults.tests_total;

    broadcast({
      type: 'submission_complete',
      data: {
        agentId,
        testsPassed,
        testsTotal,
        metrics: {
          correctness: testsPassed / testsTotal,
          executionTime: testResults.execution_time,
          memoryUsed: testResults.memory_used,
        },
      },
    });

    // Calculate score
    const correctnessScore = (testsPassed / testsTotal) * 0.5;
    const timeScore = Math.max(0, 1 - testResults.execution_time / problem.timeLimit) * 0.3;
    const memoryScore = Math.max(0, 1 - testResults.memory_used / problem.memoryLimit) * 0.2;
    const score = correctnessScore + timeScore + memoryScore;

    return {
      agent_id: agentId,
      code,
      testsPassed,
      testsTotal,
      executionTime: testResults.execution_time,
      memoryUsed: testResults.memory_used,
      score,
      rank: 0, // Will be set later
    };

  } catch (error: any) {
    console.error(`[Agent ${agentId}] Error:`, error);
    broadcast({
      type: 'agent_error',
      data: { agentId, error: error.message },
    });
    return null;
  }
}

async function generateCodeWithADK(
  adkRunner: any,
  problem: any
): Promise<string> {
  const prompt = buildPrompt(problem);

  try {
    // Use ADK runner to generate solution with ask() method
    const response = await adkRunner.ask(prompt);

    // Response is a string from ADK
    let code = typeof response === 'string' ? response : JSON.stringify(response);

    // Extract code from markdown if present
    const codeBlockMatch = code.match(/```(?:javascript|js)?\n([\s\S]*?)```/);
    if (codeBlockMatch) {
      code = codeBlockMatch[1];
    }

    return code.trim();

  } catch (error: any) {
    console.error('[ADK Agent Error]', error);
    throw new Error(`Failed to generate code: ${error.message}`);
  }
}

function buildPrompt(problem: any): string {
  const examplesText = problem.examples
    .map((ex: any) => `Input: ${JSON.stringify(ex.input)}\nOutput: ${JSON.stringify(ex.output)}`)
    .join('\n\n');

  return `Solve this coding problem in JavaScript:

**Problem: ${problem.title}**

${problem.description}

**Constraints:**
${problem.constraints.join('\n')}

**Examples:**
${examplesText}

Write a complete, working JavaScript function. Your code will be tested against multiple test cases.
Return ONLY the function code, no explanations or markdown.`;
}
