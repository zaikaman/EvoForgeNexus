/**
 * Main entry point for EvoForge Nexus
 */

import dotenv from 'dotenv';
import { log } from './utils/helpers.js';

// Load environment variables
dotenv.config();

async function main() {
  log('🌟 EvoForge Nexus - Self-Genesis Multi-Agent Ecosystem');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  log('Phase 1 Setup Complete! ✅');
  log('- Project structure initialized');
  log('- Type definitions created');
  log('- Core utilities ready\n');
  
  log('Next: Run "npm run test:adk" to verify ADK-TS integration');
  log('Then: Start implementing base agents (Phase 2)\n');
}

main().catch(console.error);
