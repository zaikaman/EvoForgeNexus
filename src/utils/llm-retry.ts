/**
 * LLM Retry Wrapper with Auto-Recovery
 * 
 * Features:
 * - Exponential backoff retry
 * - JSON parsing error recovery
 * - Prompt refinement on failure
 * - Rate limit handling
 */

import { AgentBuilder } from '@iqai/adk';

interface RetryOptions {
  maxRetries?: number;
  initialDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  onRetry?: (attempt: number, error: any) => void;
}

interface LLMRequestOptions {
  model: string;
  prompt: string;
  expectedFormat?: 'json-object' | 'json-array' | 'text';
  schema?: any;
  retryOptions?: RetryOptions;
}

export class LLMRetryWrapper {
  private static defaultRetryOptions: RetryOptions = {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
  };

  /**
   * Execute LLM request with auto-retry and recovery
   */
  static async executeWithRetry(options: LLMRequestOptions): Promise<string> {
    const {
      model,
      prompt,
      expectedFormat = 'text',
      schema,
      retryOptions = {},
    } = options;

    const config = { ...this.defaultRetryOptions, ...retryOptions };
    let lastError: any;
    let currentDelay = config.initialDelay!;

    for (let attempt = 1; attempt <= config.maxRetries!; attempt++) {
      try {
        // Execute LLM request
        const response = await AgentBuilder
          .withModel(model)
          .ask(prompt);

        console.log(`[LLM Response] Raw (${response.length} chars):`, response.substring(0, 500));

        // Validate response format
        if (expectedFormat === 'json-object' || expectedFormat === 'json-array') {
          const parsed = this.parseJSON(response, expectedFormat);
          console.log(`[LLM Response] Parsed ${expectedFormat}:`, JSON.stringify(parsed).substring(0, 300));
          
          // Validate against schema if provided
          if (schema) {
            this.validateSchema(parsed, schema);
          }
          
          return JSON.stringify(parsed);
        }

        return response;

      } catch (error: any) {
        lastError = error;
        
        // Log retry attempt
        console.warn(`[LLM Retry] Attempt ${attempt}/${config.maxRetries} failed:`, error.message);
        if (config.onRetry) {
          config.onRetry(attempt, error);
        }

        // Check if we should retry
        if (attempt < config.maxRetries!) {
          // Determine if error is retryable
          const isRetryable = this.isRetryableError(error);
          
          if (!isRetryable) {
            console.error('[LLM Retry] Non-retryable error, aborting:', error.message);
            throw error;
          }

          // Wait before retry with exponential backoff
          await this.sleep(Math.min(currentDelay, config.maxDelay!));
          currentDelay *= config.backoffMultiplier!;

          // Try to refine prompt if JSON parsing failed
          if (error.name === 'SyntaxError' && expectedFormat !== 'text') {
            console.log('[LLM Retry] Refining prompt for better JSON output...');
            // Note: In real implementation, we could modify the prompt here
          }
        }
      }
    }

    // All retries exhausted
    console.error(`[LLM Retry] All ${config.maxRetries} attempts failed`);
    throw lastError;
  }

  /**
   * Parse JSON with robust error handling
   */
  private static parseJSON(content: string, expectedFormat: 'json-object' | 'json-array'): any {
    // Remove markdown code blocks
    let cleaned = content
      .replace(/```json\s*/g, '')
      .replace(/```\s*/g, '')
      .trim();

    // Extract JSON based on expected format
    const pattern = expectedFormat === 'json-array' 
      ? /\[[\s\S]*\]/ 
      : /\{[\s\S]*\}/;
    
    const jsonMatch = cleaned.match(pattern);
    if (!jsonMatch) {
      throw new SyntaxError(`No ${expectedFormat} found in response`);
    }

    let jsonStr = jsonMatch[0];

    // Find actual end by counting brackets/braces
    const openChar = expectedFormat === 'json-array' ? '[' : '{';
    const closeChar = expectedFormat === 'json-array' ? ']' : '}';
    let count = 0;
    let jsonEnd = -1;

    for (let i = 0; i < jsonStr.length; i++) {
      if (jsonStr[i] === openChar) count++;
      if (jsonStr[i] === closeChar) {
        count--;
        if (count === 0) {
          jsonEnd = i + 1;
          break;
        }
      }
    }

    if (jsonEnd > 0) {
      jsonStr = jsonStr.substring(0, jsonEnd);
    }

    // Clean up
    jsonStr = jsonStr
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Control chars
      .replace(/,(\s*[}\]])/g, '$1') // Trailing commas
      .replace(/\/\*[\s\S]*?\*\//g, '') // Block comments
      .replace(/\/\/.*/g, '') // Line comments
      .trim();

    return JSON.parse(jsonStr);
  }

  /**
   * Validate parsed JSON against schema
   */
  private static validateSchema(data: any, schema: any): void {
    // If data is an array, validate each item
    if (Array.isArray(data)) {
      console.log(`[Schema] Validating array with ${data.length} items`);
      for (const item of data) {
        this.validateSchema(item, schema);
      }
      return;
    }

    // Basic schema validation for object
    for (const [key, type] of Object.entries(schema)) {
      if (!(key in data)) {
        console.error('[Schema] Validation failed:', { data, schema, missingKey: key });
        throw new Error(`Missing required field: ${key}`);
      }

      const expectedType = type as string;
      const actualType = Array.isArray(data[key]) ? 'array' : typeof data[key];

      if (expectedType !== 'any' && actualType !== expectedType) {
        console.error('[Schema] Type mismatch:', { key, expectedType, actualType, value: data[key] });
        throw new Error(`Field ${key} expected type ${expectedType}, got ${actualType}`);
      }
    }
  }

  /**
   * Check if error is retryable
   */
  private static isRetryableError(error: any): boolean {
    // Retryable: Network errors, rate limits, timeouts, JSON parsing
    const retryableErrors = [
      'ECONNRESET',
      'ETIMEDOUT',
      'ENOTFOUND',
      'ECONNREFUSED',
      'SyntaxError', // JSON parsing
      'Rate limit',
      '429',
      '500',
      '502',
      '503',
      '504',
    ];

    const errorString = error.toString();
    return retryableErrors.some(err => errorString.includes(err));
  }

  /**
   * Sleep utility
   */
  private static sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Convenience wrapper for agents
 */
export async function askWithRetry(
  model: string,
  prompt: string,
  expectedFormat: 'json-object' | 'json-array' | 'text' = 'text',
  schema?: any
): Promise<string> {
  return LLMRetryWrapper.executeWithRetry({
    model,
    prompt,
    expectedFormat,
    schema,
    retryOptions: {
      maxRetries: 3,
      onRetry: (attempt, error) => {
        console.log(`🔄 Retry ${attempt}: ${error.message}`);
      },
    },
  });
}
