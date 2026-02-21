'use strict';

import Comentario from './comentario.model.js';
import { validateUserExists } from '../../helpers/user-validation.js';

//Crear Publicacion
export const crearComentario = async(req, res) => {
    try {
        const comentarioData = req.body;

        // Validar que el userId existe
        const { userId } = comentarioData;
        if (!userId) {
            return res.status(400).json({
                succes: false,
                message: 'El userId es obligatorio'
            });
        }

        // Verificar que el usuario existe en el Auth-Service
        const userExists = await validateUserExists(userId);
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

//Actualizar Publicacion
export const updateComentario = async (req, res) => {
    try {
        const { id } = req.params;
        const comentarioData = req.body;
        
        const comentario = await Comentario.findByIdAndUpdate(
            id,
            comentarioData,
            { new: true, runValidators: true }
        );

        if (!comentario) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

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
        const comentario = await Comentario.findByIdAndDelete(id);

        if (!comentario) {
            return res.status(404).json({
                success: false,
                message: 'Comentario no encontrado'
            });
        }

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