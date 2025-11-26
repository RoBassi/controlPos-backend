import jwt from 'jsonwebtoken';

// 1. Verificar que el usuario está logueado
export const authenticateToken = (req, res, next) => {
  // El cliente envía: "Authorization: Bearer <TOKEN_AQUI>"
  const authHeader = req.headers['authorization'];
  
  // Separamos "Bearer" del token real
  const token = authHeader && authHeader.split(' ')[1];

  // Si no hay token, es un desconocido -> Error 401 (Unauthorized)
  if (token == null) {
    return res.status(401).json({ msg: 'Acceso denegado. No se proporcionó un token.' });
  }

  // Verificar si el token es válido y no ha expirado
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // Token manipulado o vencido -> Error 403 (Forbidden)
      return res.status(403).json({ msg: 'Token inválido o expirado.' });
    }

    // ¡Éxito! Guardamos los datos del usuario dentro de 'req' para usarlos luego
    // Ejemplo: req.user.id, req.user.role
    req.user = user;
    
    // Pasamos al siguiente paso (el Controller)
    next();
  });
};

// 2. Verificar permisos específicos (Roles)
export const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    // Si llegamos aquí, 'req.user' ya existe gracias a authenticateToken
    
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ 
        msg: `Acceso denegado. Se requiere el rol de: ${requiredRole}` 
      });
    }

    next();
  };
};