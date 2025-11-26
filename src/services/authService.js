import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as userRepository from '../repositories/userRepository.js';

export const loginUser = async (username, password) => {
  // 1. Buscar usuario (Llama al repository)
  const user = await userRepository.findByUsername(username);
  console.log("Usuario no encontrado");
  console.log("Usuario encontrado:", user.username);
  console.log("Contraseña que enviaste (Postman):", password);
  console.log("bfdb Contraseña en la Base de Datos:", user.password);
  if (!user) throw new Error('USER_NOT_FOUND');

  // 2. Validar password (Lógica de negocio)
  const isMatch = await bcrypt.compare(password, user.password);
  console.log("¿Coinciden?:", isMatch);
  if (!isMatch) throw new Error('INVALID_PASSWORD');

  // 3. Generar Token
  const token = jwt.sign(
    { id: user.id_user, role: user.role, username: user.username }, 
    process.env.JWT_SECRET, 
    { expiresIn: '8h' }
  );

  return { token, role: user.role, username: user.username };
};

export const registerUser = async (username, password, role) => {
    // Validar si ya existe
    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) throw new Error('USER_ALREADY_EXISTS');

    // Hashear password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Guardar
    return await userRepository.createUser(username, hashedPassword, role);
};