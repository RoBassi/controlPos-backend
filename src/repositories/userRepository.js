import { pool } from '../config/db.js';

export const findByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM usuario WHERE username = $1', [username]);
  return result.rows[0];
};

export const createUser = async (username, hashedPassword, role) => {
  const result = await pool.query(
    "INSERT INTO usuario (username, password, role) VALUES ($1, $2, $3) RETURNING id_user, username, role",
    [username, hashedPassword, role]
  );
  return result.rows[0];
};

export const findById = async (id) => {
    const result = await pool.query("SELECT id_user, username, role FROM usuario WHERE id_user = $1", [id]);
    return result.rows[0];
};