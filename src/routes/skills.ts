import { Router } from 'express';
import {
  getAllSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  bulkCreateSkills,
} from '../controllers/skillController';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllSkills);
router.get('/:id', getSkill);

// Admin routes
router.post('/', authenticateToken, authorizeAdmin, createSkill);
router.post('/bulk', authenticateToken, authorizeAdmin, bulkCreateSkills);
router.put('/:id', authenticateToken, authorizeAdmin, updateSkill);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteSkill);

export default router;
