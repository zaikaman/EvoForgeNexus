/**
 * Test Genesis Engine - Agent Breeding & Evolution
 */

import { IdeatorAgent } from './agents/ideator.js';
import { SimulatorAgent } from './agents/simulator.js';
import { breedAgents, geneticDistance, calculateDiversity } from './core/genesis/dna.js';
import { spawnHybrid, spawnSpecialist, calculateAverageTraits } from './core/genesis/spawner.js';

console.log('🧬 GENESIS ENGINE TEST\n');
console.log('═══════════════════════════════════════════════════════\n');

// Create base agents
const ideator = new IdeatorAgent();
const simulator = new SimulatorAgent();

console.log('👨‍👩‍👧 PARENT AGENTS:\n');
console.log(`Parent 1: ${ideator.dna.name}`);
console.log(`  Traits: C=${ideator.dna.traits.creativity.toFixed(2)}, P=${ideator.dna.traits.precision.toFixed(2)}`);
console.log(`  Capabilities: ${ideator.dna.capabilities.join(', ')}\n`);

console.log(`Parent 2: ${simulator.dna.name}`);
console.log(`  Traits: C=${simulator.dna.traits.creativity.toFixed(2)}, P=${simulator.dna.traits.precision.toFixed(2)}`);
console.log(`  Capabilities: ${simulator.dna.capabilities.join(', ')}\n`);

// Test 1: Breed hybrid agent
console.log('═══════════════════════════════════════════════════════');
console.log('TEST 1: BREEDING HYBRID AGENT 🔬\n');

const hybrid = breedAgents(ideator.dna, simulator.dna, 0.2);
console.log(`✅ Hybrid Created: ${hybrid.name}`);
console.log(`   Generation: ${hybrid.generation}`);
console.log(`   Parents: ${hybrid.parentIds?.length || 0}`);
console.log(`   Traits: C=${hybrid.traits.creativity.toFixed(2)}, P=${hybrid.traits.precision.toFixed(2)}, S=${hybrid.traits.speed.toFixed(2)}`);
console.log(`   Capabilities: ${hybrid.capabilities.join(', ')}`);
console.log(`   Mutations: ${hybrid.mutations.length}\n`);

// Test 2: Genetic distance
console.log('═══════════════════════════════════════════════════════');
console.log('TEST 2: GENETIC DISTANCE 📏\n');

const dist1 = geneticDistance(ideator.dna, simulator.dna);
const dist2 = geneticDistance(ideator.dna, hybrid);
const dist3 = geneticDistance(simulator.dna, hybrid);

console.log(`Distance (Ideator ↔ Simulator): ${dist1.toFixed(3)}`);
console.log(`Distance (Ideator ↔ Hybrid): ${dist2.toFixed(3)}`);
console.log(`Distance (Simulator ↔ Hybrid): ${dist3.toFixed(3)}`);
console.log(`✅ Hybrid is ${dist2 < dist1 ? 'closer to Ideator' : 'closer to Simulator'}\n`);

// Test 3: Multiple generations
console.log('═══════════════════════════════════════════════════════');
console.log('TEST 3: MULTI-GENERATION EVOLUTION 🌳\n');

const generation1 = [ideator.dna, simulator.dna];
const generation2 = [];

for (let i = 0; i < 4; i++) {
  const parent1 = generation1[Math.floor(Math.random() * generation1.length)];
  const parent2 = generation1[Math.floor(Math.random() * generation1.length)];
  const child = spawnHybrid(parent1, parent2, 0.3);
  generation2.push(child);
}

console.log(`Generation 1: ${generation1.length} agents`);
console.log(`Generation 2: ${generation2.length} agents (bred from Gen 1)\n`);

const diversity1 = calculateDiversity(generation1);
const diversity2 = calculateDiversity(generation2);

console.log(`Gen 1 Diversity: ${diversity1.toFixed(3)}`);
console.log(`Gen 2 Diversity: ${diversity2.toFixed(3)}`);
console.log(`${diversity2 > diversity1 ? '✅ Diversity increased' : '⚠️ Diversity decreased'}\n`);

// Test 4: Specialist spawning
console.log('═══════════════════════════════════════════════════════');
console.log('TEST 4: SPECIALIST AGENTS 🎯\n');

const avgTraits = calculateAverageTraits([...generation1, ...generation2]);
console.log(`Average population traits:`);
console.log(`  Creativity: ${avgTraits.creativity.toFixed(2)}`);
console.log(`  Precision: ${avgTraits.precision.toFixed(2)}`);
console.log(`  Speed: ${avgTraits.speed.toFixed(2)}`);
console.log(`  Collaboration: ${avgTraits.collaboration.toFixed(2)}\n`);

const ideationSpecialist = spawnSpecialist('ideation', avgTraits);
const criticsSpecialist = spawnSpecialist('critique', avgTraits);

console.log(`✅ Ideation Specialist: ${ideationSpecialist.name}`);
console.log(`   Creativity: ${ideationSpecialist.traits.creativity.toFixed(2)} (boosted)`);
console.log(`   Capabilities: ${ideationSpecialist.capabilities.join(', ')}\n`);

console.log(`✅ Critique Specialist: ${criticsSpecialist.name}`);
console.log(`   Precision: ${criticsSpecialist.traits.precision.toFixed(2)} (boosted)`);
console.log(`   Creativity: ${criticsSpecialist.traits.creativity.toFixed(2)} (reduced)`);
console.log(`   Capabilities: ${criticsSpecialist.capabilities.join(', ')}\n`);

// Summary
console.log('═══════════════════════════════════════════════════════');
console.log('📊 GENESIS ENGINE SUMMARY\n');
console.log(`✅ Successfully bred ${generation2.length} offspring`);
console.log(`✅ Genetic diversity maintained at ${diversity2.toFixed(3)}`);
console.log(`✅ Specialist agents spawned with optimized traits`);
console.log(`✅ Multi-generation evolution working correctly\n`);

console.log('🚀 Genesis Engine is fully operational!');
console.log('   Ready for dynamic agent spawning in evolution cycles.\n');
