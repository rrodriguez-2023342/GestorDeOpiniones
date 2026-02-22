'use strict';

import Comentario from './comentario.model.js';
import { validateUserExists } from '../../helpers/user-validation.js';

//Crear Comentario
export const crearComentario = async(req, res) => {
    try {
        //Obtenemos los datos del Body
        const comentarioData = req.body;

        // Validar que el userId existe
        const { userId } = comentarioData;
        const userIdFinal = userId;
        
        //Validamos que el userId venga en la peticion
        if (!userIdFinal) {
            return res.status(400).json({
                succes: false,
                message: 'El userId o usuarioId es obligatorio'
            });
        }

        // Asegurar que el campo sea userId
        comentarioData.userId = userIdFinal;

        // Verificar que el usuario existe en el Auth-Service
        const userExists = await validateUserExists(userIdFinal);
        if (!userExists) {
            return res.status(400).json({
                succes: false,
                message: 'El usuario debe ser válido'
            });
        }
        
        //Creamos una nueva instancia del comentario
        const comentario = new Comentario(comentarioData);
        //Lo guardamos en la base de datos
        await comentario.save();

        //Respuesta exitosa
        res.status(201).json({
            succes: true, 
            message: 'Comentario creado con exito!',
            data: comentario
        })
    } catch (error) {
        //Captura de errores
        res.status(400).json({
            succes: false, 
            message: 'Error al crear el comentario',
            error: error.message
        })
    }
}

//Listar Comentarios
export const getComentarios = async(req, res) => {
    try {
        //Obtenemos el page y limit desde el query
        const { page = 1, limit = 10} = req.query;

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit),
            sort: { createdAt: -1 }
        }
        //Buscamos los comentarios
        const comentarios = await Comentario.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort();

        //Contamos el total
        const total = await Comentario.countDocuments();

        res.status(200).json({
            success: true,
            data: comentarios,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                limit
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los comentarios',
            error: error.message
        })
    }
}

//Buscar comentario por Id
export const getComentarioById = async (req, res) => {
    try {
        //Obtenemos el id desde los parametros
        const { id } = req.params;
        //Buscamos el comentario por Id
        const comentario = await Comentario.findById(id);
        
        //Si no existe, mostaramos el mensaje
        if (!comentario) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }
        
        //Si existe, lo devolvemos
        res.status(200).json({
            success: true,
            data: comentario
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar el comentario',
            error: error.message
        });
    }
};

//Actualizar Comentario
export const updateComentario = async (req, res) => {
    try {
        const { id } = req.params;
        const comentarioData = req.body;
        const { userId } = comentarioData;
        const userIdFinal = userId;
        
        // Buscar el comentario para verificar propiedad
        const comentarioExistente = await Comentario.findById(id);
        
        if (!comentarioExistente) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

        // Validar que userId fue enviado
        if (!userIdFinal) {
            return res.status(400).json({
                success: false,
                message: 'El userId o usuarioId es obligatorio en el body'
            });
        }

        // Validar que el usuario que intenta actualizar es el propietario
        if (comentarioExistente.userId !== userIdFinal) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para actualizar este comentario'
            });
        }

        // Asegurar que el campo sea userId
        comentarioData.userId = userIdFinal;
        
        //Actualizamos el comentario
        const comentario = await Comentario.findByIdAndUpdate(
            id,
            comentarioData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Comentario actualizado exitosamente',
            data: comentario
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar el comentario',
            error: error.message
        });
    }
}

//Eliminar Comentario
export const deleteComentario = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, usuarioId } = req.body;
        const userIdFinal = userId || usuarioId;
        
        // Buscar el comentario para verificar propiedad
        const comentario = await Comentario.findById(id);
        
        //Validamos que venga el userId
        if (!comentario) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

        // Validar que userId fue enviado
        if (!userIdFinal) {
            return res.status(400).json({
                success: false,
                message: 'El userId o usuarioId es obligatorio en el body'
            });
        }

        // Validar que el usuario que intenta eliminar es el propietario
        if (comentario.userId !== userIdFinal) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para eliminar este comentario'
            });
        }

        //Eliminamos el comentario
        await Comentario.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Comentario eliminado exitosamente'
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al eliminar el comentario',
            error: error.message
        });
    }
}