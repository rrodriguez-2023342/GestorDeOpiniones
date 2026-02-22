'use strict';

import Comentario from './comentario.model.js';
import { validateUserExists } from '../../helpers/user-validation.js';

//Crear Publicacion
export const crearComentario = async(req, res) => {
    try {
        const comentarioData = req.body;

        // Validar que el userId o usuarioId existe
        const { userId } = comentarioData;
        const userIdFinal = userId;
        
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

        const comentario = new Comentario(comentarioData);
        await comentario.save();

        res.status(201).json({
            succes: true, 
            message: 'Comentario creado con exito!',
            data: comentario
        })
    } catch (error) {
        res.status(400).json({
            succes: false, 
            message: 'Error al crear el comentario',
            error: error.message
        })
    }
}

//Listar Publicaciones
export const getComentarios = async(req, res) => {
    try {
        const { page = 1, limit = 10} = req.query;

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit),
            sort: { createdAt: -1 }
        }

        const comentarios = await Comentario.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort();

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

//Buscar publicacion por Id
export const getComentarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const comentario = await Comentario.findById(id);
            
        if (!comentario) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }
        
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
        const { userId, usuarioId } = comentarioData;
        const userIdFinal = userId || usuarioId;
        
        // Buscar el comentario para verificar propiedad
        const comentarioExistente = await Comentario.findById(id);
        
        if (!comentarioExistente) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

        // Validar que userId o usuarioId fue enviado
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

export const deleteComentario = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, usuarioId } = req.body;
        const userIdFinal = userId || usuarioId;
        
        // Buscar el comentario para verificar propiedad
        const comentario = await Comentario.findById(id);
        
        if (!comentario) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

        // Validar que userId o usuarioId fue enviado
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