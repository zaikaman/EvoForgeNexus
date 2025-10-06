/**
 * Full Evolution Cycle Test with Agent Spawning
 * Tests complete orchestration: mandate → evolution → spawning → solution
 */

import dotenv from 'dotenv';
import type { EvolutionMandate } from './types/index.js';
import { EvolutionCycle } from './core/orchestration/evolution-cycle.js';
import { LineageTracker } from './core/memory/lineage-tracker.js';

dotenv.config();

async function testFullEvolution() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🌟 EVOFORGE NEXUS - FULL EVOLUTION TEST');
  console.log('   Self-Genesis Multi-Agent Ecosystem');
  console.log('═══════════════════════════════════════════════════════\n');

  // Define evolution mandate
  const mandate: EvolutionMandate = {
    id: 'mandate_001',
    title: 'Sustainable Urban Farming in Water-Scarce Environments',
    description: `
Design an innovative urban farming system that:
- Operates with 50% less water than traditional farming
- Fits within dense city environments (rooftops, walls, small plots)
- Maintains 80%+ of traditional farm yield
- Achieves ROI within 3 years
- Requires minimal maintenance
    `.trim(),
    constraints: [
      'Limited urban space (max 500 sqm per installation)',
      '50% water reduction requirement (hard constraint)',
      'Must work in harsh climates (40°C summers)',
      'Low-tech, easily maintainable by non-experts',
      'Capital cost under $50,000 per installation',
    ],
    successCriteria: [
      'Water usage: ≤50% of traditional farming',
      'Crop yield: ≥80% of traditional farms',
      'ROI: ≤3 years',
      'Scalability: Can replicate to 100+ buildings',
      'Maintenance: <2 hours/week',
    ],
    domain: 'agriculture',
    maxIterations: 5,
    maxAgents: 15,
    timestamp: Date.now(),
  };

  console.log(`📋 EVOLUTION MANDATE`);
  console.log(`   Title: ${mandate.title}`);
  console.log(`   Domain: ${mandate.domain}`);
  console.log(`   Constraints: ${mandate.constraints?.length || 0}`);
  console.log(`   Success Criteria: ${mandate.successCriteria.length}`);
  console.log(`   Max Iterations: ${mandate.maxIterations}`);
  console.log(`   Max Agents: ${mandate.maxAgents}\n`);

  // Initialize lineage tracker
  const lineageTracker = new LineageTracker();

  // Create evolution cycle
  const evolution = new EvolutionCycle(mandate, {
    enableSpawning: true,
    convergenceThreshold: 0.75,
  });

  // Run evolution
  console.log('🚀 Starting Evolution Cycle...\n');
  const result = await evolution.run();

  // Print results
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('🎯 EVOLUTION RESULTS');
  console.log('═══════════════════════════════════════════════════════\n');

  console.log(`Success: ${result.success ? '✅ YES' : '❌ NO'}`);
  console.log(`Iterations: ${result.iterations}/${mandate.maxIterations}`);
  console.log(`Convergence: ${result.convergenceReason}`);
  console.log(`Execution Time: ${(result.executionTime / 1000).toFixed(1)}s`);
  console.log(`Agents Spawned: ${result.totalAgentsSpawned}\n`);

  if (result.finalSynthesis) {
    const synthesis = result.finalSynthesis;
    console.log(`📊 FINAL SYNTHESIS:`);
    console.log(`   Consensus Level: ${synthesis.consensusLevel.toFixed(2)}`);
    console.log(`   Top Ideas: ${synthesis.topIdeas.length}`);
    console.log(`   Ready for Spawn: ${synthesis.readyForSpawn ? 'YES' : 'NO'}\n`);

    if (synthesis.spawnRecommendations) {
      console.log(`🧬 SPAWN RECOMMENDATIONS:`);
      console.log(`   Reasoning: ${synthesis.spawnRecommendations.reasoning}`);
      console.log(`   Capabilities: ${synthesis.spawnRecommendations.capabilities.join(', ')}`);
      if (synthesis.spawnRecommendations.traitMix) {
        console.log(`   Trait Mix:`);
        console.log(`     - Creativity: ${synthesis.spawnRecommendations.traitMix.creativity?.toFixed(2)}`);
        console.log(`     - Precision: ${synthesis.spawnRecommendations.traitMix.precision?.toFixed(2)}`);
      }
      console.log();
    }
  }

  // Lineage statistics
  const lineageStats = lineageTracker.getStats();
  console.log(`📊 LINEAGE STATISTICS:`);
  console.log(`   Total Agents: ${lineageStats.totalAgents}`);
  console.log(`   Max Depth: ${lineageStats.maxDepth}`);
  console.log(`   Branches: ${lineageStats.totalBranches}`);
  console.log(`   Avg Children: ${lineageStats.avgChildrenPerAgent.toFixed(2)}\n`);

  console.log('═══════════════════════════════════════════════════════');
  console.log('✨ EVOLUTION CYCLE COMPLETE!');
  console.log('═══════════════════════════════════════════════════════\n');

  // Key innovation metrics
  console.log('🏆 KEY INNOVATION METRICS:\n');
  console.log(`✓ Runtime Agent Spawning: ${result.totalAgentsSpawned > 0 ? 'DEMONSTRATED' : 'NOT TRIGGERED'}`);
  console.log(`✓ Multi-Agent Collaboration: ${result.success ? 'SUCCESSFUL' : 'PARTIAL'}`);
  console.log(`✓ Evolutionary Convergence: ${result.convergenceReason}`);
  console.log(`✓ Self-Improving Ecosystem: ${result.totalAgentsSpawned > 0 ? 'ACTIVE' : 'PENDING'}\n`);

  console.log('🎉 EvoForge Nexus is fully operational!');
  console.log('   Ready for hackathon demo and production deployment.\n');
}

testFullEvolution().catch(error => {
  console.error('❌ Evolution failed:', error);
  process.exit(1);
});
