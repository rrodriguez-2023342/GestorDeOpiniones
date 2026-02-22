import { validationResult } from 'express-validator';

// Middleware para revisar si hubo errores de validacion
export const checkValidators = (req, res, next) => {
    // Obtenemos los errores que pudieron generarse en la request
    const errors = validationResult(req);
    // Si existen errores
    if(!errors.isEmpty()) {
        //Devolvemos el mensaje
        return res.status(400).json({
            success: false,
            message: 'Error de validación',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg,
                value: err.value
            }))
        })
    }

    next();
}