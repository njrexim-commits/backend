import express from 'express';
import {
    authUser,
    getUserProfile,
    setupSuperAdmin,
    forgotPassword,
    resetPassword
} from '../controllers/authController.js';
import {
    getUsers,
    deleteUser,
    updateUserBySuperAdmin,
    inviteUser,
    acceptInvite
} from '../controllers/userController.js';
import { protect, superAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validatorMiddleware.js';
import { loginSchema, setupSchema } from '../utils/validationSchemas.js';
import { authLimiter } from '../middleware/securityMiddleware.js';

const router = express.Router();

router.post('/login', authLimiter, validate(loginSchema), authUser);
router.post('/setup', authLimiter, validate(setupSchema), setupSuperAdmin);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/profile', protect, getUserProfile);

// User management (Super Admin only)
router.route('/users')
    .get(protect, superAdmin, getUsers);

router.route('/users/:id')
    .put(protect, superAdmin, updateUserBySuperAdmin)
    .delete(protect, superAdmin, deleteUser);

// Invitation Routes
router.post('/invite', protect, superAdmin, inviteUser);
router.post('/accept-invite', acceptInvite);

export default router;
