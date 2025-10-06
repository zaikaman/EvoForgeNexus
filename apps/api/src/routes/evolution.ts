/**
 * Evolution API Routes
 * Handles evolution mandate submission and status tracking
 */

import { Router } from 'express';
import { startEvolution, getEvolutionStatus, getEvolutionLineage } from '../services/evolution-service.js';

const router = Router();

/**
 * POST /api/evolution/start
 * Start new evolution cycle with real EvolutionCycle
 */
router.post('/start', async (req, res) => {
  try {
    const { mandate } = req.body;
    
    if (!mandate || !mandate.title) {
      return res.status(400).json({ error: 'Invalid mandate' });
    }

    console.log('📝 Received mandate:', mandate);

    const evolutionId = await startEvolution(mandate);

    res.json({
      success: true,
      evolutionId,
      message: 'Evolution cycle started',
    });
  } catch (error: any) {
    console.error('Error starting evolution:', error);
    res.status(500).json({ error: 'Failed to start evolution', details: error.message });
  }
});

/**
 * GET /api/evolution/:id/status
 * Get evolution status
 */
router.get('/:id/status', (req, res) => {
  const { id } = req.params;
  const status = getEvolutionStatus(id);

  if (!status) {
    return res.status(404).json({ error: 'Evolution not found' });
  }

  res.json(status);
});

/**
 * GET /api/evolution/:id/lineage
 * Get agent lineage tree
 */
router.get('/:id/lineage', (req, res) => {
  const { id } = req.params;
  const lineage = getEvolutionLineage(id);

  if (!lineage) {
    return res.status(404).json({ error: 'Evolution not found' });
  }

  res.json({
    evolutionId: id,
    lineage,
  });
});

export { router as evolutionRouter };
