import * as userRepo from '../repositories/userRepository.js';
import bcrypt from 'bcryptjs';

export const getAllUsers = async () => {
    return await userRepo.findAll();
};

export const createUser = async (userData) => {
    // Hashear pass (logica de negocio)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Guardar
    return await userRepo.createUser({
        ...userData,
        password: hashedPassword
    });
};

export const updateUser = async (id, data) => {
    const updateData = { ...data };
    
    // Si viene password, la hasheamos
    if (data.password && data.password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(data.password, salt);
    } else {
        delete updateData.password; // Evitar sobreescribir con vacío
    }

    return await userRepo.updateUser(id, updateData);
};

export const deleteUser = async (id) => {
    return await userRepo.deleteUser(id);
};