'use strict';

// Middleware para verificar que el usuario tenga el rol de USER
export const USER_ROLE = (req, res, next) => {
    // Verificamos si el usuario está autenticado
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Usuario no autenticado',
            error: 'UNAUTHORIZED',
        });
    }
    //Verificamos si el rol del usuario es USER_ROLE
    if (req.user.role !== 'USER_ROLE') {
        return res.status(403).json({
            success: false,
            message: 'No tienes permisos para acceder a este recurso',
            error: 'FORBIDDEN',
            //Mostramos el rol necesario
            requiredRole: 'USER_ROLE',
            //Mostramos el rol actual
            yourRole: req.user.role,
        });
    }
    // Si todo esta bien, continua con la siguiente funcion
    next();
};