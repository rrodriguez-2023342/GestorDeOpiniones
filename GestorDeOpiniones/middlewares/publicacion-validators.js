import { body, param } from 'express-validator';
import { checkValidators } from './checkValidators.js';
import { validateJWT } from './validate-JWT.js';
import { requireRoles } from './validate-role.js';

export const validateCreatePublicacion = [
    validateJWT,
    requireRoles('USER_ROLE', 'ADMIN_ROLE'),
    body('usuarioId')
        .notEmpty()
        .withMessage('El ID del usuario es obligatorio')
        .isString()
        .withMessage('EL ID del usuario debe ser valido'),
    body('tituloPublicacion')
        .notEmpty()
        .withMessage('El titulo de la publicacion es obligatorio')
        .isLength({ min: 5, max: 100 })
        .withMessage('El titulo de la publicacion deber tener entre 5 y 100 caracteres'),
    body('categoriaPublicacion')
        .notEmpty()
        .withMessage('La categoria de la publicacion es obligatoria')
        .isLength({ max: 100 })
        .withMessage('La categoria de la publicacion debe tener como maximo 100 caracteres'),
    body('contenido')
        .notEmpty()
        .withMessage('El contenido de la publicacion es obligatorio')
        .isLength({ min: 5 })
        .withMessage('El contenido de la publicacion debe tener al menos 5 caracteres'),
    body('isActiva')
        .optional()
        .isBoolean()
        .withMessage('El campo isActiva debe ser un booleano'),
    checkValidators
];

export const validateUpdatePublicacion = [
    validateJWT,
    requireRoles('USER_ROLE', 'ADMIN_ROLE'),
    param('id')
        .notEmpty()
        .withMessage('El ID de la publicacion es obligatorio')
        .isMongoId()
        .withMessage('El ID de la publicacion debe ser un ID de MongoDB válido'),
    body('tituloPublicacion')
        .optional()
        .isLength({ min: 5, max: 100 })
        .withMessage('El titulo de la publicacion deber tener entre 5 y 100 caracteres'),
    body('categoriaPublicacion')
        .optional()
        .isLength({ max: 100 })
        .withMessage('La categoria de la publicacion debe tener como maximo 100 caracteres'),
    body('contenido')
        .optional()
        .isLength({ min: 5 })
        .withMessage('El contenido de la publicacion debe tener al menos 5 caracteres'),
    body('isActiva')
        .optional()
        .isBoolean()
        .withMessage('El campo isActiva debe ser un booleano'),
    checkValidators,
];

export const validateDeletePublicacion = [
    validateJWT,
    requireRoles('USER_ROLE', 'ADMIN_ROLE'),
    param('id')
        .notEmpty()
        .withMessage('El ID de la publicacion es obligatorio')
        .isMongoId()
        .withMessage('El ID de la publicacion debe ser un ID de MongoDB valido'),
    checkValidators,
];