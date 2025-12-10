import { Router } from 'express';
import { login, register, checkStatus, setupAdmin, forgotPassword, resetPassword } from '../controllers/authController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', login);
// Setup inicial
router.get('/status', checkStatus); // Hay usuarios?
router.post('/setup', setupAdmin);  // Crear el primer admin

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/register', authenticateToken, authorizeRole('administrador'), register);




export default router;