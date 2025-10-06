/**
 * Simulator Agent - Testing & Validation
 * 
 * Specialized in:
 * - Testing idea viability
 * - Running simulations and scenarios
 * - Calculating feasibility scores
 * - Risk assessment
 */

import { MODEL_CONFIG, CAPABILITIES } from '../utils/config.js';
import { generateId } from '../utils/helpers.js';
import { askWithRetry } from '../utils/llm-retry.js';
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

SIMULATION TASK: Assess the viability of this idea with data-driven analysis.

IMPORTANT: You MUST respond with ONLY valid JSON. No markdown, no code blocks, no explanations.

Required JSON schema:
{
  "viabilityScore": 0.75,
  "metrics": {
    "estimatedCost": "string",
    "timeToImplement": "string",
    "technicalComplexity": 0.6,
    "scalability": 0.8
  },
  "risks": ["string", "string"],
  "recommendations": ["string", "string"]
}

Rules:
- Output ONLY the JSON object
- No trailing commas
- Use double quotes for strings
- viabilityScore must be a number between 0 and 1
- metrics.technicalComplexity and metrics.scalability must be numbers between 0 and 1
- risks and recommendations arrays must contain at least 1 item each

Example valid response:
{"viabilityScore":0.72,"metrics":{"estimatedCost":"$50K-100K","timeToImplement":"6-9 months","technicalComplexity":0.65,"scalability":0.8},"risks":["Market timing uncertain","Technical dependencies"],"recommendations":["Start with MVP","Secure early partnerships"]}

Your JSON response:
`;

    const result = await askWithRetry(
      this.dna.model,
      prompt,
      'json-object',
      {
        viabilityScore: 'number',
        metrics: 'any',
        risks: 'array',
        recommendations: 'array',
      }
    );

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
        let jsonStr = jsonMatch[0];
        
        // Find actual end of JSON
        let braceCount = 0;
        let jsonEnd = -1;
        for (let i = 0; i < jsonStr.length; i++) {
          if (jsonStr[i] === '{') braceCount++;
          if (jsonStr[i] === '}') {
            braceCount--;
            if (braceCount === 0) {
              jsonEnd = i + 1;
              break;
            }
          }
        }
        if (jsonEnd > 0) {
          jsonStr = jsonStr.substring(0, jsonEnd);
        }
        
        // Clean
        jsonStr = jsonStr
          .replace(/,(\s*[}\]])/g, '$1')
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
        
        return JSON.parse(jsonStr);
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
