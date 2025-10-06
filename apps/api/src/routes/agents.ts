/**
 * Agents API Routes
 * Manages agent information and manual spawning
 */

import { Router } from 'express';

const router = Router();

// In-memory agent storage
const agents = new Map();

/**
 * GET /api/agents
 * List all agents
 */
router.get('/', (req, res) => {
  const agentList = Array.from(agents.values());
  
  res.json({
    total: agentList.length,
    agents: agentList,
  });
});

/**
 * GET /api/agents/:id
 * Get specific agent details
 */
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const agent = agents.get(id);

  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  res.json(agent);
});

/**
 * POST /api/agents/spawn
 * Manually spawn new agent
 */
router.post('/spawn', (req, res) => {
  try {
    const { name, traits, capabilities } = req.body;

    const agentId = `agent_${Date.now()}`;
    const newAgent = {
      id: agentId,
      name: name || 'Custom Agent',
      traits: traits || {
        creativity: 0.5,
        precision: 0.5,
        speed: 0.5,
        collaboration: 0.5,
      },
      capabilities: capabilities || [],
      generation: 0,
      status: 'active',
      createdAt: Date.now(),
    };

    agents.set(agentId, newAgent);

    console.log(`✨ Agent spawned manually: ${agentId}`);

    res.json({
      success: true,
      agent: newAgent,
    });
  } catch (error) {
    console.error('Error spawning agent:', error);
    res.status(500).json({ error: 'Failed to spawn agent' });
  }
});

/**
 * GET /api/agents/:id/lineage
 * Get agent's family tree
 */
router.get('/:id/lineage', (req, res) => {
  const { id } = req.params;
  const agent = agents.get(id);

  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }

  res.json({
    agentId: id,
    parents: agent.parentIds || [],
    children: agent.childrenIds || [],
    generation: agent.generation || 0,
  });
});

export { router as agentsRouter };
