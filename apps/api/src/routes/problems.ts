import { Router } from 'express';
import { getProblemsByDifficulty, getRandomProblem } from '../../../../src/data/problems-database.js';

const router = Router();

// Get problems by difficulty
router.get('/', (req, res) => {
  const { difficulty } = req.query;

  if (difficulty && typeof difficulty === 'string') {
    const problems = getProblemsByDifficulty(difficulty as any);
    return res.json({ problems });
  }

  // Return all problems grouped by difficulty
  const easy = getProblemsByDifficulty('easy');
  const medium = getProblemsByDifficulty('medium');
  const hard = getProblemsByDifficulty('hard');

  res.json({
    easy,
    medium,
    hard,
    total: easy.length + medium.length + hard.length,
  });
});

// Get random problem
router.get('/random', (req, res) => {
  const { difficulty } = req.query;
  const problem = getRandomProblem(difficulty as any);
  res.json({ problem });
});

// Get specific problem by ID
router.get('/:problemId', (req, res) => {
  const { problemId } = req.params;
  
  // Search across all difficulties
  const allProblems = [
    ...getProblemsByDifficulty('easy'),
    ...getProblemsByDifficulty('medium'),
    ...getProblemsByDifficulty('hard'),
  ];

  const problem = allProblems.find(p => p.id === problemId);

  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' });
  }

  res.json({ problem });
});

export default router;
