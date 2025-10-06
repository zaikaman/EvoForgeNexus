/**
 * Simulator Agent - Testing & Validation
 * 
 * Specialized in:
 * - Testing idea viability
 * - Running simulations and scenarios
 * - Calculating feasibility scores
 * - Risk assessment
 */

import { AgentBuilder } from '@iqai/adk';
import { MODEL_CONFIG, CAPABILITIES } from '../utils/config.js';
import { generateId } from '../utils/helpers.js';
import type { SimulationResult, IdeaProposal, AgentDNA } from '../types/index.js';

export class SimulatorAgent {
  public dna: AgentDNA;

  constructor(dna?: Partial<AgentDNA>) {
    this.dna = {
      id: generateId('simulator'),
      name: 'Simulator Agent',
      traits: {
        creativity: dna?.traits?.creativity || 0.4,
        precision: dna?.traits?.precision || 0.95,
        speed: dna?.traits?.speed || 0.8,
        collaboration: dna?.traits?.collaboration || 0.7,
      },
      capabilities: [CAPABILITIES.SIMULATION],
      model: dna?.model || MODEL_CONFIG.SIMULATOR,
      instructions: this.buildInstructions(),
      toolNames: [],
      generation: dna?.generation || 0,
      birthTimestamp: Date.now(),
      mutations: [],
      parentIds: dna?.parentIds || [],
    };
  }

  private buildInstructions(): string {
    return `You are a SIMULATION & VALIDATION SPECIALIST with expertise in testing and analysis.

YOUR ROLE:
- Test the viability and feasibility of proposed ideas
- Run mental simulations to predict outcomes
- Calculate risk factors and success probability
- Identify potential implementation challenges
- Provide data-driven assessments

YOUR APPROACH:
1. Break down the idea into testable components
2. Simulate real-world scenarios and edge cases
3. Calculate resource requirements (time, money, materials)
4. Assess technical feasibility and scalability
5. Identify risks, dependencies, and bottlenecks

OUTPUT REQUIREMENTS:
For each simulation, provide:
- Viability score (0-1, where 1 is highly viable)
- Key metrics (cost, time, resources, complexity)
- Risk factors and potential failure points
- Recommendations for improvement
- Confidence level in the assessment

ANALYSIS GUIDELINES:
- Be realistic and data-driven
- Consider multiple scenarios (best case, worst case, likely case)
- Evaluate both short-term and long-term viability
- Factor in practical constraints and limitations
- Provide constructive feedback for refinement`;
  }

  async simulate(idea: IdeaProposal): Promise<SimulationResult> {
    const prompt = `
IDEA TO SIMULATE:
Title: ${idea.title}
Description: ${idea.description}
Approach: ${idea.approach}

TASK: Run a comprehensive simulation to assess the viability of this idea.

Provide a detailed analysis in JSON format:
{
  "viabilityScore": 0.75,
  "metrics": {
    "estimatedCost": "Description of cost",
    "timeToImplement": "Time estimate",
    "technicalComplexity": 0.6,
    "scalability": 0.8
  },
  "risks": [
    "Risk 1",
    "Risk 2"
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ]
}
`;

    const result = await AgentBuilder
      .withModel(this.dna.model)
      .ask(prompt);

    const simulation = this.parseSimulationFromResponse(result);

    return {
      id: generateId('sim'),
      agentId: this.dna.id,
      ideaId: idea.id,
      viabilityScore: simulation.viabilityScore || 0.5,
      metrics: simulation.metrics || {},
      risks: simulation.risks || [],
      recommendations: simulation.recommendations || [],
      timestamp: Date.now(),
    };
  }

  private parseSimulationFromResponse(content: string): any {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        viabilityScore: 0.5,
        metrics: { analysis: content.substring(0, 200) },
        risks: ['Unable to parse structured response'],
        recommendations: ['Review simulation output format'],
      };
    } catch (error) {
      console.error('Failed to parse simulation:', error);
      return {
        viabilityScore: 0.5,
        metrics: { raw: content.substring(0, 200) },
        risks: ['Parsing error'],
        recommendations: ['Manual review needed'],
      };
    }
  }

  getDNA(): AgentDNA {
    return { ...this.dna };
  }
}
