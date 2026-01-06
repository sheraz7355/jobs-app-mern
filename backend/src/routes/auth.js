import express from 'express';
import { register, login, logout, upload } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', upload.single('logo'), register);
router.post('/login', login);
router.post('/logout', authenticate, logout);

export default router;

