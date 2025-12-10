import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
    return jwt.sign(
        { 
            id: user.id_user, 
            role: user.role, 
            username: user.username 
        },
        process.env.JWT_SECRET || 'secretkey',
        { expiresIn: '8h' }
    );
};