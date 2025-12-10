import app from './src/app.js';
import { pool } from './src/config/db.js';
import 'dotenv/config';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Probar conexion a la bd antes de iniciar
        const res = await pool.query('SELECT NOW()');
        console.log(`✅ Base de Datos conectada: ${process.env.DB_DATABASE} a las ${res.rows[0].now}`);

        // Iniciar servidor Express
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en: http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Error fatal al iniciar la aplicación:', error);
        process.exit(1); // Salir con error
    }
};

startServer();