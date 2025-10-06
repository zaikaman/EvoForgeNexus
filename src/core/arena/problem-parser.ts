/**
 * Problem Parser - Parse and validate coding problems
 */

import type { CodingProblem, TestCase, ProblemExample } from '../../types/arena.js';

/**
 * Parse problem from text/JSON format
 */
export function parseProblem(input: string | object): CodingProblem {
  if (typeof input === 'string') {
    try {
      input = JSON.parse(input);
    } catch (error) {
      throw new Error('Invalid problem format: must be valid JSON');
    }
  }

  const problem = input as Partial<CodingProblem>;

  // Validate required fields
  if (!problem.title || !problem.description) {
    throw new Error('Problem must have title and description');
  }

  // Generate ID if not provided
  const id = problem.id || generateProblemId(problem.title);

  // Set defaults
  return {
    id,
    title: problem.title,
    description: problem.description,
    difficulty: problem.difficulty || 'medium',
    category: problem.category || [],
    constraints: problem.constraints || [],
    examples: problem.examples || [],
    testCases: problem.testCases || [],
    timeLimit: problem.timeLimit || 5000,        // 5 seconds default
    memoryLimit: problem.memoryLimit || 256,     // 256 MB default
    starterCode: problem.starterCode,
    tags: problem.tags || [],
    authorId: problem.authorId,
    likes: problem.likes || 0,
    difficulty_rating: problem.difficulty_rating || getDifficultyRating(problem.difficulty),
    created_at: problem.created_at || Date.now(),
  };
}

/**
 * Generate problem ID from title
 */
function generateProblemId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Get difficulty rating for ELO calculations
 */
function getDifficultyRating(difficulty?: string): number {
  const ratings: Record<string, number> = {
    easy: 3,
    medium: 6,
    hard: 8,
    expert: 10,
  };
  return ratings[difficulty || 'medium'] || 6;
}

/**
 * Validate problem structure
 */
export function validateProblem(problem: CodingProblem): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!problem.title) errors.push('Missing title');
  if (!problem.description) errors.push('Missing description');

  // Check examples
  if (problem.examples.length === 0) {
    warnings.push('No examples provided - helps agents understand problem better');
  }

  // Check test cases
  if (problem.testCases.length === 0) {
    errors.push('At least one test case is required');
  }

  // Validate test cases
  problem.testCases.forEach((testCase, idx) => {
    if (!testCase.input) errors.push(`Test case ${idx + 1}: missing input`);
    if (!testCase.expectedOutput) errors.push(`Test case ${idx + 1}: missing expected output`);
  });

  // Check time/memory limits
  if (problem.timeLimit < 100) {
    warnings.push('Time limit very low (< 100ms) - may cause issues');
  }
  if (problem.memoryLimit < 32) {
    warnings.push('Memory limit very low (< 32MB) - may cause issues');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Create test case from input/output pair
 */
export function createTestCase(
  input: string,
  expectedOutput: string,
  options: {
    isHidden?: boolean;
    weight?: number;
    timeoutMs?: number;
  } = {}
): TestCase {
  return {
    id: generateTestCaseId(),
    input,
    expectedOutput,
    isHidden: options.isHidden ?? false,
    weight: options.weight ?? 1,
    timeoutMs: options.timeoutMs,
  };
}

/**
 * Generate unique test case ID
 */
function generateTestCaseId(): string {
  return `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Parse multiple problems from batch
 */
export function parseProblemBatch(input: string | object[]): CodingProblem[] {
  let problems: object[];

  if (typeof input === 'string') {
    try {
      problems = JSON.parse(input);
    } catch (error) {
      throw new Error('Invalid batch format: must be valid JSON array');
    }
  } else {
    problems = input;
  }

  if (!Array.isArray(problems)) {
    throw new Error('Batch must be an array of problems');
  }

  return problems.map(parseProblem);
}

/**
 * Generate starter code template
 */
export function generateStarterCode(
  problem: CodingProblem,
  language: 'javascript' | 'typescript' | 'python'
): string {
  const functionName = getFunctionName(problem.title);

  switch (language) {
    case 'javascript':
    case 'typescript':
      return `/**
 * ${problem.title}
 * ${problem.description.split('\n')[0]}
 */
function ${functionName}(/* parameters */) {
  // Your code here
}`;

    case 'python':
      return `"""
${problem.title}
${problem.description.split('\n')[0]}
"""
def ${functionName}(# parameters):
    # Your code here
    pass`;

    default:
      return '// Your code here';
  }
}

/**
 * Extract function name from problem title
 */
function getFunctionName(title: string): string {
  return title
    .split(/\s+/)
    .map((word, idx) => {
      const cleaned = word.replace(/[^a-z0-9]/gi, '');
      return idx === 0 
        ? cleaned.toLowerCase() 
        : cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
    })
    .join('');
}

/**
 * Auto-generate test cases from examples
 */
export function generateTestsFromExamples(
  examples: ProblemExample[],
  options: {
    includeHidden?: boolean;
    multiplier?: number;
  } = {}
): TestCase[] {
  const tests: TestCase[] = [];

  // Convert examples to public tests
  examples.forEach((example, idx) => {
    tests.push({
      id: `example_${idx + 1}`,
      input: example.input,
      expectedOutput: example.output,
      isHidden: false,
      weight: 1,
    });
  });

  // Generate hidden edge cases if requested
  if (options.includeHidden) {
    // Add empty input test
    tests.push({
      id: 'edge_empty',
      input: '',
      expectedOutput: '', // Should be customized per problem
      isHidden: true,
      weight: 2,
    });

    // Add large input test
    tests.push({
      id: 'edge_large',
      input: generateLargeInput(options.multiplier || 1000),
      expectedOutput: '', // Should be customized per problem
      isHidden: true,
      weight: 3,
    });
  }

  return tests;
}

/**
 * Generate large input for stress testing
 */
function generateLargeInput(size: number): string {
  return Array(size).fill(0).join(',');
}
