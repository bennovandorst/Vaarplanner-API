import express from 'express';
import { register, login } from '../controllers/authController.js';
import { getUser, deleteAccount, updateStatus } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/user', authenticate, getUser);
router.put('/update-status', updateStatus);
router.delete('/delete-account', authenticate, deleteAccount);

export default router;