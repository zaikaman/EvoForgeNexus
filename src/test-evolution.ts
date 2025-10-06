/**
 * Test All Base Agents - Complete Evolution Cycle
 */

import dotenv from 'dotenv';
import { IdeatorAgent } from './agents/ideator.js';
import { SimulatorAgent } from './agents/simulator.js';
import { CriticAgent } from './agents/critic.js';
import { SynthesisAgent } from './agents/synthesis.js';
import type { EvolutionMandate } from './types/index.js';

dotenv.config();

async function testEvolutionCycle() {
  console.log('🌟 EVOFORGE NEXUS - Evolution Cycle Test\n');
  console.log('═══════════════════════════════════════════════════════\n');

  // Create test mandate
  const mandate: EvolutionMandate = {
    id: 'test_mandate_1',
    title: 'Sustainable Urban Farming with Water Scarcity',
    description: 'Design a revolutionary urban farming system that can operate with 50% less water while maintaining high crop yields in dense city environments',
    constraints: [
      'Limited urban space (rooftops, walls)',
      '50% water reduction requirement',
      'Must be economically viable',
      'Low maintenance requirements'
    ],
    successCriteria: [
      'Reduces water usage by at least 50%',
      'Produces 80%+ of traditional farm yield',
      'ROI within 3 years',
      'Scalable to multiple buildings'
    ],
    domain: 'agriculture',
    maxIterations: 3,
    maxAgents: 10,
    timestamp: Date.now(),
  };

  console.log(`📋 Evolution Mandate: ${mandate.title}`);
  console.log(`   Domain: ${mandate.domain}`);
  console.log(`   Constraints: ${mandate.constraints?.length || 0}`);
  console.log(`   Success Criteria: ${mandate.successCriteria.length}\n`);

  // Initialize agents
  console.log('🤖 Initializing Base Agents...\n');
  const ideator = new IdeatorAgent();
  const simulator = new SimulatorAgent();
  const critic = new CriticAgent();
  const synthesis = new SynthesisAgent();

  console.log(`✅ Ideator Agent: ${ideator.dna.id}`);
  console.log(`   Creativity: ${ideator.dna.traits.creativity}, Precision: ${ideator.dna.traits.precision}`);
  
  console.log(`✅ Simulator Agent: ${simulator.dna.id}`);
  console.log(`   Precision: ${simulator.dna.traits.precision}, Speed: ${simulator.dna.traits.speed}`);
  
  console.log(`✅ Critic Agent: ${critic.dna.id}`);
  console.log(`   Precision: ${critic.dna.traits.precision}, Collaboration: ${critic.dna.traits.collaboration}`);
  
  console.log(`✅ Synthesis Agent: ${synthesis.dna.id}`);
  console.log(`   Collaboration: ${synthesis.dna.traits.collaboration}, Precision: ${synthesis.dna.traits.precision}\n`);

  // PHASE 1: IDEATION
  console.log('═══════════════════════════════════════════════════════');
  console.log('PHASE 1: IDEATION 🎨\n');
  
  const ideas = await ideator.generateIdeas(mandate, 3);
  console.log(`✅ Generated ${ideas.length} ideas:\n`);
  
  ideas.forEach((idea, i) => {
    console.log(`${i + 1}. ${idea.title}`);
    console.log(`   Novelty Score: ${idea.noveltyScore.toFixed(2)}`);
    console.log(`   ${idea.description.substring(0, 120)}...\n`);
  });

  // PHASE 2: SIMULATION
  console.log('═══════════════════════════════════════════════════════');
  console.log('PHASE 2: SIMULATION 🧪\n');
  
  const simulations = [];
  for (const idea of ideas) {
    console.log(`Simulating: ${idea.title}...`);
    const sim = await simulator.simulate(idea);
    simulations.push(sim);
    console.log(`✅ Viability Score: ${sim.viabilityScore.toFixed(2)}`);
    console.log(`   Risks: ${sim.risks.length}, Recommendations: ${sim.recommendations.length}\n`);
  }

  // PHASE 3: CRITIQUE
  console.log('═══════════════════════════════════════════════════════');
  console.log('PHASE 3: CRITIQUE 🔍\n');
  
  const critiques = [];
  for (const idea of ideas) {
    console.log(`Critiquing: ${idea.title}...`);
    const critique = await critic.critique(idea);
    critiques.push(critique);
    console.log(`✅ Assessment: ${critique.overallAssessment}`);
    console.log(`   Confidence: ${critique.confidence.toFixed(2)}`);
    console.log(`   Flaws: ${critique.flaws.length}, Strengths: ${critique.strengths.length}\n`);
  }

  // PHASE 4: SYNTHESIS
  console.log('═══════════════════════════════════════════════════════');
  console.log('PHASE 4: SYNTHESIS 🔗\n');
  
  const result = await synthesis.synthesize(ideas, simulations, critiques);
  
  console.log(`✅ Synthesis Complete!`);
  console.log(`   Consensus Level: ${result.consensusLevel.toFixed(2)}`);
  console.log(`   Top Ideas: ${result.topIdeas.length}`);
  console.log(`   Ready for Spawn: ${result.readyForSpawn ? 'YES' : 'NO'}\n`);
  
  if (result.spawnRecommendations) {
    console.log(`🧬 Spawn Recommendations:`);
    console.log(`   Reasoning: ${result.spawnRecommendations.reasoning}`);
    console.log(`   Capabilities: ${result.spawnRecommendations.capabilities.join(', ')}`);
  }

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('📊 EVOLUTION CYCLE SUMMARY\n');
  console.log(`Total Ideas Generated: ${ideas.length}`);
  console.log(`Average Novelty: ${(ideas.reduce((sum, i) => sum + i.noveltyScore, 0) / ideas.length).toFixed(2)}`);
  console.log(`Average Viability: ${(simulations.reduce((sum, s) => sum + s.viabilityScore, 0) / simulations.length).toFixed(2)}`);
  console.log(`Approved Ideas: ${critiques.filter(c => c.overallAssessment === 'approve').length}`);
  console.log(`Final Consensus: ${result.consensusLevel.toFixed(2)}`);
  
  console.log('\n✨ Evolution cycle complete!');
  console.log('🚀 All 4 base agents working successfully!\n');
}

testEvolutionCycle().catch(console.error);
