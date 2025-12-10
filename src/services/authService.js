import * as userRepo from '../repositories/userRepository.js';
import * as userService from './userService.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { generateToken } from '../utils/jwt.js';
import { sendEmail } from '../utils/mailer.js';

export const login = async (username, password) => {
    const user = await userRepo.findByUsername(username);
    if (!user) throw { status: 400, message: 'Usuario no encontrado' };

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw { status: 400, message: 'Contraseña incorrecta' };

    const token = generateToken(user);

    return {
        token,
        user: {
            id_user: user.id_user,
            username: user.username,
            role: user.role,
            email: user.email
        }
    };
};

export const register = async (userData) => {
    return await userService.createUser(userData);
};

// Recuperar pass
export const forgotPassword = async (email) => {
    const user = await userRepo.findByEmail(email);
    if (!user) throw { status: 404, message: 'No existe usuario con ese email' };

    // Generar token
    const token = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hora

    await userRepo.saveResetToken(user.id_user, token, expires);

    // Enviar correo
    const resetUrl = `http://localhost:5173/reset-password/${token}`;
    const sent = await sendEmail({
        to: user.email,
        subject: 'Recuperación de Contraseña - ControlPOS',
        text: `Hola ${user.username}, para resetear tu contraseña haz click aquí: ${resetUrl}`
    });

    if (!sent) throw { status: 500, message: 'Error al enviar el correo' };
    return { message: 'Correo enviado correctamente' };
};

export const resetPassword = async (token, newPassword) => {
    const user = await userRepo.findByResetToken(token);
    if (!user) throw { status: 400, message: 'Token inválido o expirado' };

    // userRepo.updateUser, hasheamos aca
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Actualizar pass
    await userRepo.updateUser(user.id_user, { password: hashedPassword, username: user.username, email: user.email, role: user.role });
    
    // Limpiar token
    await userRepo.clearResetToken(user.id_user);

    return { message: 'Contraseña actualizada con éxito' };
};