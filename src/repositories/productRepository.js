import { pool } from '../config/db.js';

export const findAll = async () => {
    const query = `
        SELECT p.*, c.nombre as nombre_categoria 
        FROM producto p
        LEFT JOIN categoria c ON p.categoria_id = c.id_categoria
        ORDER BY p.id_product DESC
    `;
    const result = await pool.query(query);
    return result.rows;
};

export const findById = async (id) => {
    const result = await pool.query('SELECT * FROM producto WHERE id_product = $1', [id]);
    return result.rows[0];
};

export const create = async (data) => {
    const { codigo_barras, nombre, descripcion, precio_costo, precio_venta, stock, categoria_id, stock_minimo } = data;
    
    const query = `
        INSERT INTO producto 
        (codigo_barras, nombre, descripcion, precio_costo, precio_venta, stock, categoria_id, stock_minimo)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
    `;
    const values = [codigo_barras, nombre, descripcion, precio_costo, precio_venta, stock, categoria_id, stock_minimo];
    
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const update = async (id, data) => {
    const { codigo_barras, nombre, descripcion, precio_costo, precio_venta, stock, categoria_id, stock_minimo } = data;
    
    const query = `
        UPDATE producto
        SET codigo_barras = $1,
            nombre = $2,
            descripcion = $3,
            precio_costo = $4,
            precio_venta = $5,
            stock = $6,
            categoria_id = $7,
            stock_minimo = $8
        WHERE id_product = $9
        RETURNING *
    `;
    const values = [codigo_barras, nombre, descripcion, precio_costo, precio_venta, stock, categoria_id, stock_minimo, id];
    
    const result = await pool.query(query, values);
    return result.rows[0];
};

export const remove = async (id) => {
    const result = await pool.query('DELETE FROM producto WHERE id_product = $1 RETURNING id_product', [id]);
    return result.rows[0]; // Retorna el ID eliminado o undefined si no existía
};