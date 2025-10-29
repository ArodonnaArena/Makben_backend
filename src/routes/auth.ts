import { Router } from 'express';
import { register, login, getMe, changePassword, createUser, listUsers, updateUserRole, deleteUser } from '../controllers/authController';
import { authenticateToken, authorizeRoles } from '../middleware/auth';

const router = Router();

// Registration endpoint: first user becomes superadmin; otherwise requires superadmin auth
router.post('/register', register);

router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.put('/change-password', authenticateToken, changePassword);

// Superadmin-only user management
router.get('/users', authenticateToken, authorizeRoles('superadmin'), listUsers);
router.post('/users', authenticateToken, authorizeRoles('superadmin'), createUser);
router.put('/users/:id/role', authenticateToken, authorizeRoles('superadmin'), updateUserRole);
router.delete('/users/:id', authenticateToken, authorizeRoles('superadmin'), deleteUser);

export default router;
