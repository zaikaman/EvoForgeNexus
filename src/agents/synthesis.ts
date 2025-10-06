/**
 * Synthesis Agent - Integration & Consensus Building
 * 
 * Specialized in:
 * - Combining multiple perspectives
 * - Building consensus
 * - Optimization and refinement
 * - Decision making on agent spawning
 */

import { AgentBuilder } from '@iqai/adk';
import { MODEL_CONFIG, CAPABILITIES } from '../utils/config.js';
import { generateId, average } from '../utils/helpers.js';
import type { 
  SynthesisResult, 
  IdeaProposal, 
  SimulationResult, 
  CritiqueResult,
  AgentDNA 
} from '../types/index.js';

export class SynthesisAgent {
  public dna: AgentDNA;

  constructor(dna?: Partial<AgentDNA>) {
    this.dna = {
      id: generateId('synthesis'),
      name: 'Synthesis Agent',
      traits: {
        creativity: dna?.traits?.creativity || 0.6,
        precision: dna?.traits?.precision || 0.85,
        speed: dna?.traits?.speed || 0.7,
        collaboration: dna?.traits?.collaboration || 0.95,
      },
      capabilities: [CAPABILITIES.SYNTHESIS, CAPABILITIES.OPTIMIZATION],
      model: dna?.model || MODEL_CONFIG.SYNTHESIS,
      instructions: this.buildInstructions(),
      toolNames: [],
      generation: dna?.generation || 0,
      birthTimestamp: Date.now(),
      mutations: [],
      parentIds: dna?.parentIds || [],
    };
  }

  private buildInstructions(): string {
    return `You are a SYNTHESIS & INTEGRATION SPECIALIST with expertise in combining perspectives.

YOUR ROLE:
- Integrate insights from ideation, simulation, and critique
- Build consensus from diverse viewpoints
- Optimize solutions by combining best elements
- Decide when to spawn new specialized agents
- Provide unified, actionable recommendations

YOUR APPROACH:
1. Analyze all inputs (ideas, simulations, critiques)
2. Identify patterns, agreements, and conflicts
3. Synthesize the best elements into coherent solutions
4. Evaluate readiness for implementation or further evolution
5. Recommend next steps (including agent spawning)

OUTPUT REQUIREMENTS:
Provide a comprehensive synthesis including:
- Top ideas ranked by potential
- Combined approach integrating best elements
- Consensus level (0-1)
- Decision on spawning new agents
- If spawning: recommended trait mix and capabilities

SYNTHESIS GUIDELINES:
- Balance creativity with feasibility
- Respect critiques while maintaining innovation
- Look for synergies between different ideas
- Identify when specialization is needed (spawn agents)
- Provide clear, actionable recommendations`;
  }

  async synthesize(
    ideas: IdeaProposal[],
    simulations: SimulationResult[],
    critiques: CritiqueResult[]
  ): Promise<SynthesisResult> {
    const prompt = `
SYNTHESIS TASK:
You have received outputs from multiple agents working on a problem.

IDEAS (${ideas.length}):
${ideas.map((idea, i) => `${i + 1}. ${idea.title} (novelty: ${idea.noveltyScore})\n   ${idea.description.substring(0, 150)}...`).join('\n')}

SIMULATIONS (${simulations.length}):
${simulations.map((sim, i) => `${i + 1}. Viability: ${sim.viabilityScore}, Risks: ${sim.risks.length}`).join('\n')}

CRITIQUES (${critiques.length}):
${critiques.map((c, i) => `${i + 1}. Assessment: ${c.overallAssessment}, Flaws: ${c.flaws.length}, Strengths: ${c.strengths.length}`).join('\n')}

TASK: Synthesize these inputs into a unified recommendation.

Provide your synthesis in JSON format:
{
  "topIdeas": ["idea_id_1", "idea_id_2"],
  "combinedApproach": "Detailed description of the synthesized solution...",
  "consensusLevel": 0.75,
  "readyForSpawn": false,
  "spawnRecommendations": null
}

If readyForSpawn is true, include:
{
  "readyForSpawn": true,
  "spawnRecommendations": {
    "traitMix": {
      "creativity": 0.7,
      "precision": 0.8,
      "speed": 0.6,
      "collaboration": 0.7
    },
    "capabilities": ["optimization", "implementation"],
    "reasoning": "Why we need this new agent"
  }
}
`;

    const result = await AgentBuilder
      .withModel(this.dna.model)
      .ask(prompt);

    const synthesis = this.parseSynthesisFromResponse(result, ideas);

    // Calculate consensus level from data
    const avgViability = average(simulations.map(s => s.viabilityScore));
    const approvedCount = critiques.filter(c => c.overallAssessment === 'approve').length;
    const calculatedConsensus = (avgViability + (approvedCount / Math.max(critiques.length, 1))) / 2;

    return {
      id: generateId('synthesis'),
      agentId: this.dna.id,
      topIdeas: synthesis.topIdeas || ideas.slice(0, 2).map(i => i.id),
      combinedApproach: synthesis.combinedApproach || 'Synthesis in progress',
      consensusLevel: synthesis.consensusLevel || calculatedConsensus,
      readyForSpawn: synthesis.readyForSpawn || false,
      spawnRecommendations: synthesis.spawnRecommendations,
      timestamp: Date.now(),
    };
  }

  private parseSynthesisFromResponse(content: string, ideas: IdeaProposal[]): any {
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        topIdeas: ideas.slice(0, 2).map(i => i.id),
        combinedApproach: content.substring(0, 300),
        consensusLevel: 0.6,
        readyForSpawn: false,
      };
    } catch (error) {
      console.error('Failed to parse synthesis:', error);
      return {
        topIdeas: ideas.slice(0, 2).map(i => i.id),
        combinedApproach: 'Synthesis parsing failed',
        consensusLevel: 0.5,
        readyForSpawn: false,
      };
    }
  }

  getDNA(): AgentDNA {
    return { ...this.dna };
  }
}
