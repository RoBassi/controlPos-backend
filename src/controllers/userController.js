import * as userService from '../services/userService.js';

export const getUsers = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers();
        res.json(users);
    } catch (error) {
        next(error); // Pasa el error al middleware global
    }
};

export const createUser = async (req, res, next) => {
    try {
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        // Codigos especificos de Postgres
        if (error.code === '23505') {
            return res.status(400).json({ message: 'El usuario o email ya existe' });
        }
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const updated = await userService.updateUser(req.params.id, req.body);
        res.json(updated);
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id);
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        next(error);
    }
};