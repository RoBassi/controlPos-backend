const pool = require('./src/config/db');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedAdmin = async () => {
    try {
        // 1. Verificar si ya existe algún administrador
        const checkAdmin = await pool.query("SELECT * FROM usuario WHERE role = 'administrador'");
        
        if (checkAdmin.rows.length > 0) {
            console.log('--- Ya existen administradores. No se requiere acción. ---');
            return;
        }

        // 2. Si no existe, crear el primero usando variables de entorno
        const username = process.env.ADMIN_USER || 'admin_inicial';
        const password = process.env.ADMIN_PASS || 'admin123';
        const role = 'administrador';

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await pool.query(
            "INSERT INTO usuario (username, password, role) VALUES ($1, $2, $3)",
            [username, hashedPassword, role]
        );

        console.log(`*** Usuario Administrador Inicial (${username}) creado exitosamente ***`);

    } catch (err) {
        console.error('Error en el seeding:', err.message);
    } finally {
        pool.end();
    }
};

seedAdmin();