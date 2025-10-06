/**
 * API Key Rotation Manager
 * Round-robin rotation with automatic retry on rate limits
 */

export class ApiKeyManager {
  private keys: string[] = [];
  private currentIndex = 0;
  private failedKeys = new Set<number>();
  private resetTimeout: NodeJS.Timeout | null = null;

  constructor(prefix: string = 'GOOGLE_API_KEY') {
    this.loadKeys(prefix);
  }

  /**
   * Load API keys from environment variables
   * Supports GOOGLE_API_KEY, GOOGLE_API_KEY_2, GOOGLE_API_KEY_3, etc.
   */
  private loadKeys(prefix: string): void {
    const keys: string[] = [];
    
    // Load primary key
    const primaryKey = process.env[prefix];
    if (primaryKey) {
      keys.push(primaryKey);
    }

    // Load numbered keys (2-10)
    for (let i = 2; i <= 10; i++) {
      const key = process.env[`${prefix}_${i}`];
      if (key) {
        keys.push(key);
      }
    }

    if (keys.length === 0) {
      throw new Error(`No API keys found with prefix ${prefix}`);
    }

    this.keys = keys;
    console.log(`🔑 Loaded ${keys.length} API keys for rotation`);
  }

  /**
   * Get next API key using round-robin
   */
  getNextKey(): string {
    if (this.keys.length === 0) {
      throw new Error('No API keys available');
    }

    // Find next available key (skip failed ones)
    let attempts = 0;
    while (attempts < this.keys.length) {
      const key = this.keys[this.currentIndex];
      const keyIndex = this.currentIndex;
      
      // Move to next index for next call
      this.currentIndex = (this.currentIndex + 1) % this.keys.length;
      
      // Check if this key is marked as failed
      if (!this.failedKeys.has(keyIndex)) {
        return key;
      }
      
      attempts++;
    }

    // All keys failed - reset and try again
    console.warn('⚠️ All API keys exhausted, resetting failed keys');
    this.failedKeys.clear();
    return this.keys[this.currentIndex];
  }

  /**
   * Mark current key as failed (rate limited)
   */
  markKeyAsFailed(key: string): void {
    const keyIndex = this.keys.indexOf(key);
    if (keyIndex !== -1) {
      this.failedKeys.add(keyIndex);
      console.warn(`❌ API key #${keyIndex + 1} marked as rate-limited`);
      
      // Auto-reset failed keys after 60 seconds
      this.scheduleReset();
    }
  }

  /**
   * Schedule automatic reset of failed keys
   */
  private scheduleReset(): void {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }

    this.resetTimeout = setTimeout(() => {
      console.log('🔄 Resetting rate-limited API keys');
      this.failedKeys.clear();
      this.resetTimeout = null;
    }, 60000); // 60 seconds
  }

  /**
   * Get total number of available keys
   */
  getTotalKeys(): number {
    return this.keys.length;
  }

  /**
   * Get number of currently failed keys
   */
  getFailedKeysCount(): number {
    return this.failedKeys.size;
  }

  /**
   * Get current rotation status
   */
  getStatus(): { total: number; available: number; failed: number; currentIndex: number } {
    return {
      total: this.keys.length,
      available: this.keys.length - this.failedKeys.size,
      failed: this.failedKeys.size,
      currentIndex: this.currentIndex,
    };
  }
}

// Singleton instance for Google API keys
let googleKeyManager: ApiKeyManager | null = null;

export function getGoogleKeyManager(): ApiKeyManager {
  if (!googleKeyManager) {
    googleKeyManager = new ApiKeyManager('GOOGLE_API_KEY');
  }
  return googleKeyManager;
}

/**
 * Execute a function with automatic API key rotation on rate limits
 */
export async function withApiKeyRotation<T>(
  fn: (apiKey: string) => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  const keyManager = getGoogleKeyManager();
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const apiKey = keyManager.getNextKey();
    
    try {
      const result = await fn(apiKey);
      return result;
    } catch (error: any) {
      lastError = error;
      
      // Check if error is rate limit related
      const isRateLimit = 
        error?.message?.toLowerCase().includes('rate limit') ||
        error?.message?.toLowerCase().includes('quota') ||
        error?.message?.toLowerCase().includes('429') ||
        error?.status === 429;

      if (isRateLimit) {
        console.warn(`⚠️ Rate limit hit on attempt ${attempt + 1}, rotating key...`);
        keyManager.markKeyAsFailed(apiKey);
        
        // Continue to next attempt with different key
        continue;
      }

      // Non-rate-limit error, throw immediately
      throw error;
    }
  }

  // All retries exhausted
  throw new Error(`Failed after ${maxRetries} retries. Last error: ${lastError?.message}`);
}
