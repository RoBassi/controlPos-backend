import express from 'express';
import * as authController from '../controllers/authController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authenticateToken, authorizeRole('administrador'), authController.register);

export default router;