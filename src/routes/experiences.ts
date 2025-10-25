import { Router } from 'express';
import {
  getAllExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from '../controllers/experienceController';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', getAllExperiences);
router.get('/:id', getExperience);

// Admin routes
router.post(
  '/',
  authenticateToken,
  authorizeAdmin,
  upload.single('companyLogo'),
  createExperience
);

router.put(
  '/:id',
  authenticateToken,
  authorizeAdmin,
  upload.single('companyLogo'),
  updateExperience
);

router.delete('/:id', authenticateToken, authorizeAdmin, deleteExperience);

export default router;
