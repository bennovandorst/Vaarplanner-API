import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { adminLogin, getAdminProfile } from '../controllers/adminController.js';
import { getAllUsers, /*createUser, updateUser,*/ deleteAccount } from '../controllers/userController.js';
import { createRole, getRoles, updateRole, deleteRole } from '../controllers/roleController.js';
import { getAnalyticsData } from '../controllers/analyticsController.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/profile', authenticate, getAdminProfile);

router.get('/users', authenticate, getAllUsers);
//router.post('/users', authenticate, createUser);
//router.put('/users/:id', authenticate, updateUser);
router.delete('/users/:id', authenticate, deleteAccount);

router.post('/roles', authenticate, createRole);
router.get('/roles', authenticate, getRoles);
router.put('/roles/:id', authenticate, updateRole);
router.delete('/roles/:id', authenticate, deleteRole);

router.get('/analytics', authenticate, getAnalyticsData); 

export default router;