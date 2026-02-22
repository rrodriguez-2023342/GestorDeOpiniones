import { body, param } from 'express-validator';
import { checkValidators } from './checkValidators.js';
import { validateJWT } from './validate-JWT.js';
import { requireRoles } from './validate-role.js';

//Validacion para crear un comentario
export const validateCreateComentario = [
    validateJWT, //Validar que el usuario este auntenticado
    requireRoles('USER_ROLE', 'ADMIN_ROLE'), //Verificar los roles permitidos
    body('contenidoComentario')
        .trim()
        .notEmpty()
        .withMessage('El contenido del comentario es obligatorio')
        .isLength({ min: 5, max: 500 })
        .withMessage('El contenido del comentario debe tener entre 5 y 500 caracteres'),
    body('publicacionId')
        .notEmpty()
        .withMessage('El ID de la publicacion es obligatorio')
        .isMongoId()
        .withMessage('El ID de la publicacion debe ser un ID de MongoDB valido'),
    body('userId')
        .notEmpty()
        .withMessage('El ID del usuario es obligatorio')
        .isString()
        .withMessage('El ID del usuario debe ser una cadena de texto'),
    checkValidators, //Revisar si hubo errores
];

//Validadion para editar el comentario
export const validateUpdateComentario = [
    validateJWT, //validomos la autenticacion
    requireRoles('USER_ROLE', 'ADMIN_ROLE'), //roles permitidos
    param('id')
        .notEmpty()
        .withMessage('El ID del comentario es obligatorio')
        .isMongoId()
        .withMessage('El ID del comentario debe ser un ID de MongoDB válido'),
    body('contenidoComentario')
        .optional()
        .trim()
        .isLength({ min: 5, max: 500 })
        .withMessage('El contenido del comentario debe tener entre 5 y 500 caracteres'),
    body('publicacionId')
        .optional()
        .isMongoId()
        .withMessage('El ID de la publicacion debe ser un ID de MongoDB valido'),
    body('userId')
        .optional()
        .isString()
        .withMessage('El ID del usuario debe ser una cadena de texto'),
    checkValidators, //Verificar errores
];

//Validacion para eliminar comentario
export const validateDeleteComentario = [
    validateJWT, //veidficar la autenticacion
    requireRoles('USER_ROLE', 'ADMIN_ROLE'), //roles permitidos
    param('id')
        .notEmpty()
        .withMessage('El ID del comentario es obligatorio')
        .isMongoId()
        .withMessage('El ID del comentario debe ser un ID de MongoDB válido'),
    checkValidators, //Verificar si hubo errores
]