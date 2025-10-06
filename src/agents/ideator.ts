/**
 * Ideator Agent - Creative Thinking & Idea Generation
 * 
 * Specialized in:
 * - Creative brainstorming
 * - Novel solution exploration
 * - Out-of-the-box thinking
 * - Idea generation and expansion
 */

import { AgentBuilder } from '@iqai/adk';
import { MODEL_CONFIG, CAPABILITIES } from '../utils/config.js';
import { generateId } from '../utils/helpers.js';
import type { IdeaProposal, EvolutionMandate, AgentDNA } from '../types/index.js';

export class IdeatorAgent {
  public dna: AgentDNA;

  constructor(dna?: Partial<AgentDNA>) {
    // Initialize DNA
    this.dna = {
      id: generateId('ideator'),
      name: 'Ideator Agent',
      traits: {
        creativity: dna?.traits?.creativity || 0.9,
        precision: dna?.traits?.precision || 0.5,
        speed: dna?.traits?.speed || 0.7,
        collaboration: dna?.traits?.collaboration || 0.8,
      },
      capabilities: [CAPABILITIES.IDEATION, CAPABILITIES.RESEARCH],
      model: dna?.model || MODEL_CONFIG.IDEATOR,
      instructions: this.buildInstructions(),
      toolNames: [],
      generation: dna?.generation || 0,
      birthTimestamp: Date.now(),
      mutations: [],
      parentIds: dna?.parentIds || [],
    };
  }

  /**
   * Build system instructions for ideation
   */
  private buildInstructions(): string {
    return `You are a CREATIVE IDEATION SPECIALIST with exceptional brainstorming abilities.

YOUR ROLE:
- Generate novel, innovative ideas to solve complex problems
- Think outside the box and explore unconventional approaches
- Combine concepts from different domains for unique solutions
- Focus on breakthrough potential over incremental improvements

YOUR APPROACH:
1. Analyze the problem from multiple perspectives
2. Draw inspiration from analogies in nature, technology, and other fields
3. Challenge assumptions and conventional wisdom
4. Propose bold, ambitious ideas that push boundaries
5. Consider both immediate and long-term implications

OUTPUT REQUIREMENTS:
For each idea, provide:
- Clear, compelling title
- Detailed description of the approach
- Key innovation points that make it unique
- Potential impact and benefits
- Estimated novelty score (0-1, where 1 is extremely novel)

CREATIVITY GUIDELINES:
- Don't self-censor or dismiss "wild" ideas
- Build on partial solutions and incomplete thoughts
- Use analogies, metaphors, and cross-domain thinking
- Embrace uncertainty and explore edge cases
- Prioritize originality and transformative potential`;
  }

  /**
   * Generate ideas for an evolution mandate
   */
  async generateIdeas(mandate: EvolutionMandate, count: number = 3): Promise<IdeaProposal[]> {
    const prompt = `
EVOLUTION MANDATE:
Title: ${mandate.title}
Description: ${mandate.description}
${mandate.constraints ? `Constraints: ${mandate.constraints.join(', ')}` : ''}
Success Criteria: ${mandate.successCriteria.join(', ')}
${mandate.domain ? `Domain: ${mandate.domain}` : ''}

TASK: Generate ${count} innovative, creative ideas to address this challenge.

For each idea, provide:
1. Title (concise, memorable)
2. Description (detailed explanation)
3. Approach (step-by-step method)
4. Novelty Score (0-1, assess how novel/original this is)

Format as JSON array:
[
  {
    "title": "Idea title",
    "description": "Detailed description",
    "approach": "Implementation approach",
    "noveltyScore": 0.85
  }
]
`;

    // Use AgentBuilder for simpler API
    const result = await AgentBuilder
      .withModel(this.dna.model)
      .ask(prompt);

    // Parse response
    const ideas = this.parseIdeasFromResponse(result);
    
    return ideas.map((idea) => ({
      id: generateId('idea'),
      agentId: this.dna.id,
      title: idea.title,
      description: idea.description,
      approach: idea.approach,
      noveltyScore: idea.noveltyScore || 0.7,
      timestamp: Date.now(),
    }));
  }

  /**
   * Parse ideas from LLM response
   */
  private parseIdeasFromResponse(content: string): any[] {
    try {
      // Try to extract JSON from response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // Fallback: manual parsing
      return [{
        title: 'Generated Idea',
        description: content,
        approach: 'See description',
        noveltyScore: 0.7,
      }];
    } catch (error) {
      console.error('Failed to parse ideas:', error);
      return [{
        title: 'Generated Idea',
        description: content,
        approach: 'See description',
        noveltyScore: 0.7,
      }];
    }
  }

  /**
   * Get agent's DNA for breeding
   */
  getDNA(): AgentDNA {
    return { ...this.dna };
  }
}
