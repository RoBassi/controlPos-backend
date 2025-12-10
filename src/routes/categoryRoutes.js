import { Router } from 'express';
import { getCategories, createCategory } from '../controllers/categoryController.js';
import { authenticateToken } from '../middleware/authMiddleware.js'; 

const router = Router();

router.use(authenticateToken);

router.get('/', getCategories);
router.post('/', createCategory);

export default router;