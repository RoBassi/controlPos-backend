import { pool } from '../config/db.js';

export const findByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM usuario WHERE username = $1', [username]);
  return result.rows[0];
};

export const findById = async (id) => {
  const result = await pool.query("SELECT id_user, username, email, role FROM usuario WHERE id_user = $1", [id]);
  return result.rows[0];
}

export const createUser = async (userData) => {
  const { username, password, email, role } = userData;

  const query = `
        INSERT INTO usuario (username, password, email, role) 
        VALUES ($1, $2, $3, $4) 
        RETURNING id_user, username, email, role, updated_at
    `;

  const values = [username, password, email, role];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const findAll = async () => {
    const res = await pool.query('SELECT id_user, username, email, role, updated_at FROM usuario ORDER BY id_user ASC');
    return res.rows;
};

export const updateUser = async (id, data) => {
    const { username, email, role, password } = data;
    
    if (password) {
        const res = await pool.query(
            `UPDATE usuario SET username=$1, email=$2, role=$3, password=$4, updated_at=NOW() WHERE id_user=$5 RETURNING id_user, username, email, role, updated_at`,
            [username, email, role, password, id]
        );
        return res.rows[0];
    } else {
        const res = await pool.query(
            `UPDATE usuario SET username=$1, email=$2, role=$3, updated_at=NOW() WHERE id_user=$4 RETURNING id_user, username, email, role, updated_at`,
            [username, email, role, id]
        );
        return res.rows[0];
    }
};

export const deleteUser = async (id) => {
    await pool.query('DELETE FROM usuario WHERE id_user = $1', [id]);
};

export const findByEmail = async (email) => {
    const res = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
    return res.rows[0];
};

export const saveResetToken = async (userId, token, expires) => {
    await pool.query(
        "UPDATE usuario SET reset_token = $1, reset_token_expires = $2 WHERE id_user = $3",
        [token, expires, userId]
    );
};

export const findByResetToken = async (token) => {
    // Usa new Date() de JS para comparar, asi evitamos problemas de zona horaria con la DB
    const now = new Date();
    
    const res = await pool.query(
        "SELECT * FROM usuario WHERE reset_token = $1 AND reset_token_expires > $2",
        [token, now]
    );
    return res.rows[0];
};

export const clearResetToken = async (userId) => {
    await pool.query(
        "UPDATE usuario SET reset_token = NULL, reset_token_expires = NULL WHERE id_user = $1",
        [userId]
    );
};

export const hasUsers = async () => {
    const res = await pool.query('SELECT COUNT(*) FROM usuario');
    return parseInt(res.rows[0].count) > 0;
};