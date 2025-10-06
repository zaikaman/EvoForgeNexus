/**
 * Test Ideator Agent
 */

import dotenv from 'dotenv';
import { IdeatorAgent } from './agents/ideator.js';
import type { EvolutionMandate } from './types/index.js';

dotenv.config();

async function testIdeator() {
  console.log('🧪 Testing Ideator Agent...\n');

  // Create test mandate
  const mandate: EvolutionMandate = {
    id: 'test_1',
    title: 'Sustainable Urban Farming',
    description: 'Design a sustainable urban farming system resilient to 50% water scarcity',
    constraints: ['Limited space', 'Water scarcity', 'Urban environment'],
    successCriteria: ['Reduces water usage by 50%', 'Produces sufficient food', 'Economically viable'],
    domain: 'agriculture',
    timestamp: Date.now(),
  };

  // Create ideator agent
  const ideator = new IdeatorAgent();
  console.log('✅ Ideator Agent created');
  console.log(`   DNA ID: ${ideator.dna.id}`);
  console.log(`   Creativity: ${ideator.dna.traits.creativity}`);
  console.log(`   Model: ${ideator.dna.model}\n`);

  // Generate ideas
  console.log('🎨 Generating ideas...\n');
  const ideas = await ideator.generateIdeas(mandate, 3);

  console.log(`✅ Generated ${ideas.length} ideas:\n`);
  ideas.forEach((idea, i) => {
    console.log(`${i + 1}. ${idea.title}`);
    console.log(`   Novelty: ${idea.noveltyScore}`);
    console.log(`   ${idea.description.substring(0, 100)}...\n`);
  });

  console.log('🚀 Ideator Agent test complete!');
}

testIdeator().catch(console.error);
