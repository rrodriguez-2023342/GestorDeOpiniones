'use strict';

// Middleware para verificar que el usuario tenga el rol de ADMIN
export const ADMIN_ROLE = (req, res, next) => {
    //Verificamos si el usuario esta autenticado
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Usuario no autenticado',
            error: 'UNAUTHORIZED',
        });
    }

    //Verificamos si el rol del usuario es ADMIN_ROLE
    if (req.user.role !== 'ADMIN_ROLE') {
        return res.status(403).json({
            success: false,
            message: 'No tienes permisos para acceder a este recurso',
            error: 'FORBIDDEN',
            //Mostrar el rol necesario
            requiredRole: 'ADMIN_ROLE',
            //Mostrar el rol actual
            yourRole: req.user.role,
        });
    }
    //Si pasa las validaciones, continua con la siguiente funcion
    next();
};