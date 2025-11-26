import { pool } from '../config/db.js';

export const findAll = async (search, rubro) => {
  let query = `
    SELECT p.*, c.nombre as nombre_categoria 
    FROM producto p 
    LEFT JOIN categoria c ON p.categoria_id = c.id_categoria
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    query += ` AND (p.nombre ILIKE $${params.length} OR p.codigo_barras ILIKE $${params.length})`;
  }

  if (rubro) {
    params.push(rubro);
    query += ` AND c.nombre ILIKE $${params.length}`; 
  }

  query += ' ORDER BY p.nombre ASC';
  const result = await pool.query(query, params);
  return result.rows;
};

export const findLowStock = async () => {
    const result = await pool.query(`
      SELECT p.nombre, p.stock, p.stock_minimo, c.nombre as categoria
      FROM producto p
      JOIN categoria c ON p.categoria_id = c.id_categoria
      WHERE p.stock <= p.stock_minimo
      ORDER BY p.stock ASC
    `);
    return result.rows;
};

export const create = async (productData) => {
    const { codigo_barras, nombre, descripcion, precio_costo, precio_venta, stock, stock_minimo, categoria_id } = productData;
    const result = await pool.query(
      `INSERT INTO producto 
      (codigo_barras, nombre, descripcion, precio_costo, precio_venta, stock, stock_minimo, categoria_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [codigo_barras, nombre, descripcion, precio_costo, precio_venta, stock, stock_minimo, categoria_id]
    );
    return result.rows[0];
};

// ... Agregar update y delete aquí con la misma lógica