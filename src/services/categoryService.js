import * as categoryRepo from '../repositories/categoryRepository.js';

export const getAllCategories = async () => {
    return await categoryRepo.findAllCategories();
};

export const createCategory = async (nombre) => {
    const nombreNormalizado = nombre.trim();
    return await categoryRepo.createCategory(nombreNormalizado);
};