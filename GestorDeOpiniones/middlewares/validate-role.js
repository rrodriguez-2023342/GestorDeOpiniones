'use strict';

// Middleware para permitir solo ciertos roles
export const requireRoles = (...allowedRoles) => {
    //Devuele un middleware
    return (req, res, next) => {
        //Verifica que el usuario este autenticado
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado',
                error: 'UNAUTHORIZED',
            });
        }
        //Obtenemos el rol del usuario
        const userRole = req.user.role;
        //Verificamos si el rol esta incluido dentro de los roles permitidos
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para acceder a este recurso',
                error: 'FORBIDDEN',
                requiredRoles: allowedRoles, //Mostramos los roles permitidos
                yourRole: userRole, //Mostranos el rol del usuario
            });
        }

        next();
    };
};