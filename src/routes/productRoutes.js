import express from 'express';
import * as productController from '../controllers/productController.js';
import { authenticateToken, authorizeRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticateToken, productController.getProducts);
router.get('/bajo-stock', authenticateToken, productController.getLowStock);
router.post('/', authenticateToken, authorizeRole('administrador'), productController.createProduct);

export default router;