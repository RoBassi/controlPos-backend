import { pool } from '../config/db.js';

export const findAllCategories = async () => {
    const result = await pool.query('SELECT * FROM categoria ORDER BY nombre ASC');
    return result.rows;
};

export const createCategory = async (nombre) => {
    // RETURNING * nos devuelve el objeto creado (con su ID generado)
    const result = await pool.query(
        'INSERT INTO categoria (nombre) VALUES ($1) RETURNING *',
        [nombre]
    );
    return result.rows[0];
};