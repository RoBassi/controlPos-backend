import { Router } from 'express';
import { 
    getProducts, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from '../controllers/productController.js';
import { authenticateToken } from '../middleware/authMiddleware.js'; 

const router = Router();
router.use(authenticateToken);

// Rutas base: /api/productos
router.get('/', getProducts);
router.post('/', createProduct);

// Rutas con ID
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;