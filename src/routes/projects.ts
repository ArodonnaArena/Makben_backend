import { Router } from 'express';
import {
  getAllProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController';
import { authenticateToken, authorizeAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', getAllProjects);
router.get('/:id', getProject);

// Admin routes
router.post(
  '/',
  authenticateToken,
  authorizeAdmin,
  upload.fields([
    { name: 'imageUrl', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  createProject
);

router.put(
  '/:id',
  authenticateToken,
  authorizeAdmin,
  upload.fields([
    { name: 'imageUrl', maxCount: 1 },
    { name: 'images', maxCount: 10 },
  ]),
  updateProject
);

router.delete('/:id', authenticateToken, authorizeAdmin, deleteProject);

export default router;
