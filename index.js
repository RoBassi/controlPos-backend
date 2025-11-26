import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({ 
    status: 'API Online', 
    message: 'Backend de ControlPOS funcionando correctamente' 
  });
});

// Rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en: http://localhost:${PORT}`);
  console.log(`Base de Datos: ${process.env.DB_DATABASE}`);
});