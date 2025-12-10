const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// Configuración de transporte de correo (Ejemplo con Gmail o SMTP genérico)
// Para pruebas locales, recomiendo usar https://ethereal.email/
const transporter = nodemailer.createTransport({
    service: 'Gmail', // O tu servicio SMTP
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// 1. RUTA: Solicitar recuperación (POST /api/forgot-password)
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Verificar si el usuario existe por email
        const userQuery = await pool.query("SELECT * FROM usuario WHERE email = $1", [email]);
        if (userQuery.rows.length === 0) {
            return res.status(404).json({ msg: 'No existe usuario con ese email' });
        }

        const user = userQuery.rows[0];

        // Generar token aleatorio
        const token = crypto.randomBytes(20).toString('hex');
        // Expiración en 1 hora
        const expires = new Date(Date.now() + 3600000); 

        // Guardar token y fecha en la DB
        await pool.query(
            "UPDATE usuario SET reset_token = $1, reset_token_expires = $2 WHERE id_user = $3",
            [token, expires, user.id_user]
        );

        // Crear enlace de recuperación (ajusta la URL a tu frontend)
        const resetUrl = `http://localhost:5173/reset-password/${token}`;

        // Enviar correo
        const mailOptions = {
            to: user.email,
            from: 'tuapp@soporte.com',
            subject: 'Recuperación de Contraseña',
            text: `Hola ${user.username}, para resetear tu contraseña haz click aquí: ${resetUrl}`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ msg: 'Correo de recuperación enviado' });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
};

// 2. RUTA: Cambiar la contraseña (POST /api/reset-password/:token)
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        // Buscar usuario con ese token y que el tiempo no haya expirado
        const userQuery = await pool.query(
            "SELECT * FROM usuario WHERE reset_token = $1 AND reset_token_expires > NOW()",
            [token]
        );

        if (userQuery.rows.length === 0) {
            return res.status(400).json({ msg: 'Token inválido o expirado' });
        }

        const user = userQuery.rows[0];

        // Hashear nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Actualizar password y limpiar los campos de token
        await pool.query(
            "UPDATE usuario SET password = $1, reset_token = NULL, reset_token_expires = NULL, updated_at = NOW() WHERE id_user = $2",
            [hashedPassword, user.id_user]
        );

        res.json({ msg: 'Contraseña actualizada correctamente' });

    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
};

module.exports = { forgotPassword, resetPassword };