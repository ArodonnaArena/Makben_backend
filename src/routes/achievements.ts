import { Router } from 'express';
import {
  getAllAchievements,
  getAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement,
} from '../controllers/achievementController';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', getAllAchievements);
router.get('/:id', getAchievement);

// Admin routes
router.post(
  '/',
  authenticateToken,
  authorizeAdmin,
  upload.fields([
    { name: 'achievement', maxCount: 1 },
    { name: 'document', maxCount: 1 },
  ]),
  createAchievement
);

router.put(
  '/:id',
  authenticateToken,
  authorizeAdmin,
  upload.fields([
    { name: 'achievement', maxCount: 1 },
    { name: 'document', maxCount: 1 },
  ]),
  updateAchievement
);

router.delete('/:id', authenticateToken, authorizeAdmin, deleteAchievement);

export default router;
