import { Router } from 'express';
import { executeRealBattle } from '../services/real-battle.js';

const router = Router();

// Active battles storage
const activeBattles = new Map<string, any>();

// Start a new battle
router.post('/start', async (req, res) => {
  try {
    const { problemId, agentIds, difficulty } = req.body;

    if (!problemId || !agentIds || !Array.isArray(agentIds)) {
      return res.status(400).json({ error: 'Invalid request: problemId and agentIds required' });
    }

    const battleId = `battle_${Date.now()}`;
    
    // Initialize battle
    const battle = {
      id: battleId,
      problemId,
      agentIds,
      difficulty,
      status: 'running',
      startTime: new Date(),
      submissions: [],
    };

    activeBattles.set(battleId, battle);

    // Execute battle with real OpenAI API
    executeRealBattle(battleId, problemId, agentIds).catch((error: any) => {
      console.error(`[Battle ${battleId}] Error:`, error);
      (battle as any).status = 'failed';
      (battle as any).error = error.message;
    });

    res.json({ 
      battleId,
      status: 'started',
      message: 'Battle execution started. Connect to WebSocket for real-time updates.'
    });

  } catch (error: any) {
    console.error('[Battle Start Error]', error);
    res.status(500).json({ error: error.message });
  }
});

// Get battle status
router.get('/:battleId', (req, res) => {
  const { battleId } = req.params;
  const battle = activeBattles.get(battleId);

  if (!battle) {
    return res.status(404).json({ error: 'Battle not found' });
  }

  res.json(battle);
});

// Get all active battles
router.get('/', (req, res) => {
  const battles = Array.from(activeBattles.values());
  res.json({ battles });
});

export default router;
