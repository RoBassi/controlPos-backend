const bcrypt = require('bcryptjs');
const pool = require('./server');

const crearAdmin = async () => {
    const username = 'admin';
    const password = 'adminpassword';
    const role = 'administrador';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        await pool.query(
            "INSERT INTO usuarios (username, password, role) VALUES ($1, $2, $3)",
            [username, hashedPassword, role]
        );
        console.log('Usuario administrador creado con éxito.');
    } catch (err) {
        console.error(err.message);
    } finally {
        pool.end();
    }
};

crearAdmin();