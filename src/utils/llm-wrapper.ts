/**
 * LLM Wrapper with API Key Rotation
 * Wraps ADK AgentBuilder to use rotating API keys
 */

import { AgentBuilder } from '@iqai/adk';
import { withApiKeyRotation, getGoogleKeyManager } from './api-key-manager.js';

/**
 * Execute LLM request with automatic key rotation
 */
export async function askWithRotation(
  model: string,
  prompt: string
): Promise<string> {
  return withApiKeyRotation(async (apiKey) => {
    // Temporarily override the API key in environment
    const originalKey = process.env.GOOGLE_API_KEY;
    process.env.GOOGLE_API_KEY = apiKey;
    
    try {
      const result = await AgentBuilder
        .withModel(model)
        .ask(prompt);
      
      return result;
    } finally {
      // Restore original key
      if (originalKey) {
        process.env.GOOGLE_API_KEY = originalKey;
      }
    }
  });
}

/**
 * Get API key manager status for monitoring
 */
export function getApiKeyStatus() {
  return getGoogleKeyManager().getStatus();
}
