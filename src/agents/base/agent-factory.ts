/**
 * Base Agent Factory
 * Creates specialized agents with predefined configurations
 */

import { Agent } from '@iqai/adk';
import { MODEL_CONFIG } from '../../utils/config.js';
import type { AgentDNA } from '../../types/index.js';

export interface BaseAgentConfig {
  name: string;
  description: string;
  instructions: string;
  model?: string;
  tools?: any[];
  dna?: Partial<AgentDNA>;
}

/**
 * Create a base agent with DNA tracking
 */
export function createBaseAgent(config: BaseAgentConfig): Agent {
  return new Agent({
    name: config.name,
    description: config.description,
    instruction: config.instructions,
    model: config.model || MODEL_CONFIG.IDEATOR,
    tools: config.tools || [],
  });
}
