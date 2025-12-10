import { Router } from 'express';
import { createSale, getMethods, getReports, getSaleDetails } from '../controllers/saleController.js';
import { authenticateToken } from '../middleware/authMiddleware.js'; 

const router = Router();

router.use(authenticateToken); 

router.get('/metodos-pago', getMethods);
router.post('/', createSale);
router.get('/reportes', getReports); // ?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/:id', getSaleDetails);  // Detalle de una venta

export default router;