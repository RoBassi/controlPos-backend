import * as categoryService from '../services/categoryService.js';

export const getCategories = async (req, res, next) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (req, res, next) => {
    try {
        const { nombre } = req.body;
        
        if (!nombre) {
            return res.status(400).json({ message: 'El nombre es obligatorio' });
        }

        const newCategory = await categoryService.createCategory(nombre);
        res.status(201).json(newCategory);
    } catch (error) {
        if (error.code === '23505') { 
            return res.status(400).json({ message: 'La categoría ya existe' });
        }
        next(error);
    }
};