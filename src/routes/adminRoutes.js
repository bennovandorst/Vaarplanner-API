import express from 'express';
import { authenticate } from '../middlewares/authMiddleware.js';
import { adminLogin, getAdminProfile } from '../controllers/adminController.js';
import { getAllUsers, /*createUser, updateUser,*/ deleteAccount } from '../controllers/userController.js';
import { createRole, getRoles, updateRole, deleteRole } from '../controllers/roleController.js';
import { getAnalyticsData } from '../controllers/analyticsController.js';

const router = express.Router();

// Admin Authentication
router.post('/login', adminLogin);
router.get('/profile', authenticate, getAdminProfile);

// User Management (Admin Only)
router.get('/users', authenticate, getAllUsers);  // Get all users
//router.post('/users', authenticate, createUser);  // Create new user
//router.put('/users/:id', authenticate, updateUser);  // Update user by ID
router.delete('/users/:id', authenticate, deleteAccount);  // Delete user by ID

// Role Management (Admin Only)
router.post('/roles', authenticate, createRole);  // Create new role
router.get('/roles', authenticate, getRoles);  // Get all roles
router.put('/roles/:id', authenticate, updateRole);  // Update role by ID
router.delete('/roles/:id', authenticate, deleteRole);  // Delete role by ID

// Analytics (Admin Only)
router.get('/analytics', authenticate, getAnalyticsData);  // Get analytics data

export default router;