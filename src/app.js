import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Middlewares globales
app.use(cors()); // Configúralo más estricto para producción si es necesario
app.use(express.json());

// Rutas de la API 
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/categorias', categoryRoutes);
app.use('/api/ventas', saleRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.json({ 
    status: 'API Online', 
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ 
      success: false, 
      message: 'Endpoint no encontrado' 
  });
});

// Middleware de errores 
app.use(errorHandler);

export default app;