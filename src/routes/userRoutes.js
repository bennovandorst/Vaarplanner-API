import express from 'express';
import { register, login } from '../controllers/authController.js';
import { getUser, deleteAccount, updateStatus, uploadAvatar, updateAvatar, deleteAvatar } from '../controllers/userController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/avatarUpload.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', authenticate, getUser);
router.put('/update-status', updateStatus);
router.delete('/delete-account', authenticate, deleteAccount);
router.post('/avatar/upload', authenticate, upload.single('avatar'), uploadAvatar);
router.put('/avatar/update', authenticate, upload.single('avatar'), updateAvatar);
router.delete('/avatar/delete', authenticate, deleteAvatar);

export default router;