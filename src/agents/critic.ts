/**
 * Critic Agent - Adversarial Reasoning & Quality Control
 * 
 * Specialized in:
 * - Critical analysis
 * - Bias detection
 * - Flaw identification
 * - Constructive criticism
 */

import { MODEL_CONFIG, CAPABILITIES } from '../utils/config.js';
import { generateId } from '../utils/helpers.js';
import { askWithRotation } from '../utils/llm-wrapper.js';
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

CRITICAL TASK: Provide a thorough critical analysis.

IMPORTANT: You MUST respond with ONLY valid JSON. No markdown, no code blocks, no explanations.

Required JSON schema:
{
  "flaws": ["string", "string"],
  "strengths": ["string", "string"],
  "biasesDetected": ["string"],
  "overallAssessment": "approve" | "needs_revision" | "reject",
  "confidence": 0.8
}

Rules:
- Output ONLY the JSON object
- Arrays must contain at least 1 item
- No trailing commas
- Use double quotes for strings
- overallAssessment must be exactly one of: "approve", "needs_revision", "reject"
- confidence must be a number between 0 and 1

Example valid response:
{"flaws":["Lacks scalability analysis","Unclear implementation path"],"strengths":["Novel approach","Addresses core problem"],"biasesDetected":["Confirmation bias in metrics"],"overallAssessment":"needs_revision","confidence":0.75}

Your JSON response:
`;

    const result = await askWithRotation(this.dna.model, prompt);

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
      // Step 1: Remove markdown code blocks if present
      let cleaned = content.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Step 2: Extract JSON object
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON object found in response');
        return this.getFallbackCritique('No JSON object found');
      }
      
      let jsonStr = jsonMatch[0];
      
      // Step 3: Aggressive cleaning
      jsonStr = jsonStr
        // Remove control characters
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        // Fix trailing commas in arrays/objects
        .replace(/,(\s*[}\]])/g, '$1')
        // Remove comments
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*/g, '')
        // Normalize whitespace
        .replace(/\s+/g, ' ')
        .trim();
      
      // Step 4: Try parsing
      const parsed = JSON.parse(jsonStr);
      
      // Step 5: Validate structure
      if (!parsed.flaws || !Array.isArray(parsed.flaws)) {
        parsed.flaws = [];
      }
      if (!parsed.strengths || !Array.isArray(parsed.strengths)) {
        parsed.strengths = [];
      }
      if (!parsed.biasesDetected || !Array.isArray(parsed.biasesDetected)) {
        parsed.biasesDetected = [];
      }
      if (!parsed.overallAssessment) {
        parsed.overallAssessment = 'needs_revision';
      }
      if (typeof parsed.confidence !== 'number') {
        parsed.confidence = 0.5;
      }
      
      return parsed;
    } catch (error) {
      console.error('Failed to parse critique:', error);
      console.error('Content preview:', content.substring(0, 200));
      return this.getFallbackCritique('Parsing error occurred');
    }
  }
  
  private getFallbackCritique(reason: string): any {
    return {
      flaws: [reason],
      strengths: [],
      biasesDetected: [],
      overallAssessment: 'needs_revision',
      confidence: 0.5,
    };
  }

  getDNA(): AgentDNA {
    return { ...this.dna };
  }
}
