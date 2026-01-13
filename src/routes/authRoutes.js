import express from 'express';
import {
    authUser,
    getUserProfile,
    setupSuperAdmin
} from '../controllers/authController.js';
import {
    getUsers,
    deleteUser,
    updateUserBySuperAdmin
} from '../controllers/userController.js';
import { protect, superAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/setup', setupSuperAdmin);
router.get('/profile', protect, getUserProfile);

// User management (Super Admin only)
router.route('/users')
    .get(protect, superAdmin, getUsers);

router.route('/users/:id')
    .put(protect, superAdmin, updateUserBySuperAdmin)
    .delete(protect, superAdmin, deleteUser);

export default router;
