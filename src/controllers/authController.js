import * as authService from '../services/authService.js';

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await authService.loginUser(username, password);
    res.json(result);
  } catch (error) {
    if (error.message === 'USER_NOT_FOUND' || error.message === 'INVALID_PASSWORD') {
        return res.status(400).json({ msg: 'Credenciales inválidas' });
    }
    res.status(500).json({ msg: 'Error del servidor' });
  }
};

export const register = async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const newUser = await authService.registerUser(username, password, role);
        res.status(201).json(newUser);
    } catch (error) {
        if (error.message === 'USER_ALREADY_EXISTS') {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }
        res.status(500).json({ msg: error.message });
    }
};
