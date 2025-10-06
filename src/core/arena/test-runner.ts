/**
 * Test Runner - Execute and validate code submissions
 */

import type { ExecutionResult, TestCase } from '../../types/arena.js';

/**
 * Run code against test cases
 */
export async function runTests(
  code: string,
  testCases: TestCase[],
  language: string,
  options: {
    timeLimit?: number;
    memoryLimit?: number;
  } = {}
): Promise<ExecutionResult> {
  const startTime = Date.now();
  const timeLimit = options.timeLimit || 5000;
  const memoryLimit = options.memoryLimit || 256;

  const result: ExecutionResult = {
    status: 'running',
    tests_passed: 0,
    tests_total: testCases.length,
    passed_test_ids: [],
    failed_test_ids: [],
    execution_time: 0,
    memory_used: 0,
  };

  try {
    // Validate syntax first
    const syntaxError = validateSyntax(code, language);
    if (syntaxError) {
      result.status = 'compilation_error';
      result.error_message = syntaxError;
      result.execution_time = Date.now() - startTime;
      return result;
    }

    // Run each test case
    for (const testCase of testCases) {
      const testStartTime = Date.now();

      try {
        const output = await executeCode(
          code,
          testCase.input,
          language,
          {
            timeout: testCase.timeoutMs || timeLimit,
            memory: memoryLimit,
          }
        );

        const testTime = Date.now() - testStartTime;

        // Check timeout
        if (testTime > (testCase.timeoutMs || timeLimit)) {
          result.status = 'time_limit_exceeded';
          result.failed_test_ids.push(testCase.id);
          result.error_message = `Test case ${testCase.id} exceeded time limit`;
          break;
        }

        // Compare output
        if (normalizeOutput(output) === normalizeOutput(testCase.expectedOutput)) {
          result.tests_passed++;
          result.passed_test_ids.push(testCase.id);
        } else {
          result.status = 'wrong_answer';
          result.failed_test_ids.push(testCase.id);
          result.error_message = `Test case ${testCase.id} failed.\nExpected: ${testCase.expectedOutput}\nGot: ${output}`;
        }

      } catch (error) {
        result.status = 'runtime_error';
        result.failed_test_ids.push(testCase.id);
        result.error_message = `Runtime error in test ${testCase.id}: ${error instanceof Error ? error.message : String(error)}`;
        break;
      }
    }

    // Set final status
    if (result.status === 'running') {
      result.status = result.tests_passed === result.tests_total ? 'accepted' : 'wrong_answer';
    }

  } catch (error) {
    result.status = 'runtime_error';
    result.error_message = error instanceof Error ? error.message : String(error);
  }

  result.execution_time = Date.now() - startTime;
  result.memory_used = estimateMemoryUsage(code);

  return result;
}

/**
 * Validate code syntax
 */
function validateSyntax(code: string, language: string): string | null {
  try {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        // Try to parse with Function constructor
        new Function(code);
        return null;

      case 'python':
        // Would need python interpreter - skip for now
        return null;

      default:
        return `Unsupported language: ${language}`;
    }
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

/**
 * Execute code in sandbox
 */
async function executeCode(
  code: string,
  input: string,
  language: string,
  options: {
    timeout: number;
    memory: number;
  }
): Promise<string> {
  switch (language.toLowerCase()) {
    case 'javascript':
    case 'typescript':
      return executeJavaScript(code, input, options);

    case 'python':
      // Would need python interpreter integration
      throw new Error('Python execution not yet implemented');

    default:
      throw new Error(`Unsupported language: ${language}`);
  }
}

/**
 * Execute JavaScript code in isolated context
 * TODO: Add proper sandboxing with vm2 or isolated-vm
 */
async function executeJavaScript(
  code: string,
  input: string,
  options: {
    timeout: number;
    memory: number;
  }
): Promise<string> {
  try {
    // Parse input
    const inputData = parseInput(input);

    // Wrap code to capture output
    const wrappedCode = `
      ${code}
      
      // Execute main function
      const input = ${JSON.stringify(inputData)};
      const result = typeof solve === 'function' 
        ? solve(...(Array.isArray(input) ? input : [input]))
        : (typeof main === 'function' 
          ? main(...(Array.isArray(input) ? input : [input]))
          : null);
      
      JSON.stringify(result);
    `;

    // Create timeout wrapper
    const executeWithTimeout = new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Execution timeout'));
      }, options.timeout);

      try {
        // WARNING: Using Function() - not secure for production
        // TODO: Replace with proper sandbox (vm2, isolated-vm, or worker_threads)
        const fn = new Function(wrappedCode);
        const result = fn();
        clearTimeout(timer);
        resolve(String(result));
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });

    return await executeWithTimeout;

  } catch (error) {
    throw new Error(`Execution error: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Parse input string to appropriate types
 */
function parseInput(input: string): any {
  try {
    // Try JSON parse first
    return JSON.parse(input);
  } catch {
    // Return as string if not valid JSON
    return input;
  }
}

/**
 * Normalize output for comparison
 */
function normalizeOutput(output: string): string {
  return output
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

/**
 * Estimate memory usage (rough approximation)
 */
function estimateMemoryUsage(code: string): number {
  // Very rough estimate: count variables, arrays, objects
  const variables = (code.match(/\b(let|const|var)\b/g) || []).length;
  const arrays = (code.match(/\[.*?\]/g) || []).length;
  const objects = (code.match(/\{.*?\}/g) || []).length;

  // Estimate in MB (very rough)
  const baseMem = 1; // 1 MB base
  const varMem = variables * 0.01; // ~10KB per variable
  const arrMem = arrays * 0.1; // ~100KB per array
  const objMem = objects * 0.05; // ~50KB per object

  return Math.round((baseMem + varMem + arrMem + objMem) * 100) / 100;
}

/**
 * Compare execution results
 */
export function compareResults(
  result1: ExecutionResult,
  result2: ExecutionResult
): {
  faster: number; // 1 if result1 faster, 2 if result2 faster, 0 if tie
  better: number; // Overall better solution
  details: string;
} {
  // More tests passed wins
  if (result1.tests_passed !== result2.tests_passed) {
    return {
      faster: 0,
      better: result1.tests_passed > result2.tests_passed ? 1 : 2,
      details: 'More tests passed',
    };
  }

  // Both passed all tests - compare performance
  if (result1.tests_passed === result1.tests_total) {
    const timeDiff = result1.execution_time - result2.execution_time;
    const memDiff = result1.memory_used - result2.memory_used;

    if (Math.abs(timeDiff) < 10 && Math.abs(memDiff) < 1) {
      return { faster: 0, better: 0, details: 'Tie - similar performance' };
    }

    // Time is more important than memory
    if (Math.abs(timeDiff) > 50) {
      return {
        faster: timeDiff < 0 ? 1 : 2,
        better: timeDiff < 0 ? 1 : 2,
        details: `${Math.abs(timeDiff)}ms faster`,
      };
    }

    return {
      faster: memDiff < 0 ? 1 : 2,
      better: memDiff < 0 ? 1 : 2,
      details: `${Math.abs(memDiff).toFixed(2)}MB less memory`,
    };
  }

  return { faster: 0, better: 0, details: 'Both failed' };
}
