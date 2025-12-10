import * as authService from '../services/authService.js';

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await authService.login(username, password);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const register = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        next(error);
    }
};

export const forgotPassword = async (req, res, next) => {
    try {
        const result = await authService.forgotPassword(req.body.email);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const result = await authService.resetPassword(token, newPassword);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const checkStatus = async (req, res, next) => {
    try {
        const initialized = await authService.isSystemInitialized();
        res.json({ initialized });
    } catch (error) {
        next(error);
    }
};

export const setupAdmin = async (req, res, next) => {
    try {
        const newUser = await authService.createFirstAdmin(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};