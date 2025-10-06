/**
 * Test ADK-TS integration
 * Simple test to verify ADK setup is working correctly
 */

import { AgentBuilder } from '@iqai/adk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testADKIntegration() {
  console.log('🧪 Testing ADK-TS Integration...\n');

  try {
    // Test 1: Simple query with AgentBuilder
    console.log('Test 1: Simple query with AgentBuilder');
    const response = await AgentBuilder
      .withModel('gemini-2.5-flash')
      .ask('What is 15 + 27? Just give me the number.');

    console.log('✅ Response:', response);
    console.log('');

    // Test 2: Create a basic agent
    console.log('Test 2: Create a basic agent');
    const { agent } = await AgentBuilder
      .create('test_agent')
      .withModel('gemini-2.5-flash')
      .withDescription('A test agent for integration testing')
      .withInstruction('You are a helpful test agent. Keep responses concise.')
      .build();

    console.log('✅ Agent created:', agent.name);
    console.log('');

    console.log('✅ All tests passed! ADK-TS is working correctly.\n');
    console.log('🚀 Ready to build EvoForge Nexus!\n');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('\n⚠️  Make sure you have:');
    console.error('   1. Created a .env file with GOOGLE_API_KEY');
    console.error('   2. Installed dependencies with: npm install');
    console.error('   3. Valid API key from https://aistudio.google.com/apikey\n');
    process.exit(1);
  }
}

// Run the test
testADKIntegration();
