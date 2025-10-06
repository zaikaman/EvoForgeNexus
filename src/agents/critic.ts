/**
 * Critic Agent - Adversarial Reasoning & Quality Control
 * 
 * Specialized in:
 * - Critical analysis
 * - Bias detection
 * - Flaw identification
 * - Constructive criticism
 */

import { AgentBuilder } from '@iqai/adk';
import { MODEL_CONFIG, CAPABILITIES } from '../utils/config.js';
import { generateId } from '../utils/helpers.js';
import type { CritiqueResult, IdeaProposal, SimulationResult, AgentDNA } from '../types/index.js';

export class CriticAgent {
  public dna: AgentDNA;

  constructor(dna?: Partial<AgentDNA>) {
    this.dna = {
      id: generateId('critic'),
      name: 'Critic Agent',
      traits: {
        creativity: dna?.traits?.creativity || 0.3,
        precision: dna?.traits?.precision || 0.9,
        speed: dna?.traits?.speed || 0.7,
        collaboration: dna?.traits?.collaboration || 0.6,
      },
      capabilities: [CAPABILITIES.CRITIQUE],
      model: dna?.model || MODEL_CONFIG.CRITIC,
      instructions: this.buildInstructions(),
      toolNames: [],
      generation: dna?.generation || 0,
      birthTimestamp: Date.now(),
      mutations: [],
      parentIds: dna?.parentIds || [],
    };
  }

  private buildInstructions(): string {
    return `You are a CRITICAL ANALYSIS SPECIALIST with expertise in finding flaws and improvements.

YOUR ROLE:
- Provide constructive, adversarial criticism
- Identify weaknesses, biases, and logical flaws
- Challenge assumptions and test robustness
- Ensure quality and rigor in solutions
- Play devil's advocate to strengthen ideas

YOUR APPROACH:
1. Analyze the idea/solution from multiple critical angles
2. Identify logical inconsistencies and weak points
3. Detect biases (confirmation bias, survivorship bias, etc.)
4. Question assumptions and test edge cases
5. Provide balanced feedback (strengths + weaknesses)

OUTPUT REQUIREMENTS:
For each critique, provide:
- List of identified flaws and weaknesses
- Strengths that should be preserved
- Detected biases or blind spots
- Overall assessment (approve/reject/needs_revision)
- Confidence level (0-1)

CRITIQUE GUIDELINES:
- Be thorough but constructive
- Focus on improving, not just criticizing
- Identify both technical and conceptual issues
- Consider ethical implications and unintended consequences
- Balance rigor with pragmatism`;
  }

  async critique(target: IdeaProposal | SimulationResult): Promise<CritiqueResult> {
    const isIdea = 'noveltyScore' in target;
    const prompt = `
${isIdea ? 'IDEA' : 'SIMULATION'} TO CRITIQUE:
${isIdea ? `Title: ${(target as IdeaProposal).title}
Description: ${(target as IdeaProposal).description}
Approach: ${(target as IdeaProposal).approach}` : 
`Viability Score: ${(target as SimulationResult).viabilityScore}
Metrics: ${JSON.stringify((target as SimulationResult).metrics)}
Risks: ${(target as SimulationResult).risks.join(', ')}`}

TASK: Provide a thorough critical analysis of this ${isIdea ? 'idea' : 'simulation'}.

Provide your critique in JSON format:
{
  "flaws": [
    "Flaw 1",
    "Flaw 2"
  ],
  "strengths": [
    "Strength 1",
    "Strength 2"
  ],
  "biasesDetected": [
    "Bias 1"
  ],
  "overallAssessment": "needs_revision",
  "confidence": 0.8
}
`;

    const result = await AgentBuilder
      .withModel(this.dna.model)
      .ask(prompt);

    const critique = this.parseCritiqueFromResponse(result);

    return {
      id: generateId('critique'),
      agentId: this.dna.id,
      targetId: target.id,
      flaws: critique.flaws || [],
      strengths: critique.strengths || [],
      biasesDetected: critique.biasesDetected || [],
      overallAssessment: critique.overallAssessment || 'needs_revision',
      confidence: critique.confidence || 0.7,
      timestamp: Date.now(),
    };
  }

  private parseCritiqueFromResponse(content: string): any {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        flaws: ['Unable to parse structured response'],
        strengths: [],
        biasesDetected: [],
        overallAssessment: 'needs_revision',
        confidence: 0.5,
      };
    } catch (error) {
      console.error('Failed to parse critique:', error);
      return {
        flaws: ['Parsing error occurred'],
        strengths: [],
        biasesDetected: [],
        overallAssessment: 'needs_revision',
        confidence: 0.5,
      };
    }
  }

  getDNA(): AgentDNA {
    return { ...this.dna };
  }
}
