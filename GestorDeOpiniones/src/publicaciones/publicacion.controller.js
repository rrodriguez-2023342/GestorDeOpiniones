'use strict';

import Publicacion from './publicacion.model.js';
import { uploadImage } from '../../helpers/cloudinary-service.js';
import { validateUserExists } from '../../helpers/user-validation.js';

//Crear Publicacion
export const crearPublicacion = async(req, res) => {
    try {
        const publicacionData = req.body;
        let imagenUrl = null;

        // Validar que el usuarioId existe
        const { usuarioId } = publicacionData;
        if (!usuarioId) {
            return res.status(400).json({
                succes: false,
                message: 'El usuarioId es obligatorio'
            });
        }

        // Verificar que el usuario existe en el Auth-Service
        const userExists = await validateUserExists(usuarioId);
        if (!userExists) {
            return res.status(400).json({
                succes: false,
                message: 'El usuario debe ser válido'
            });
        }

        // Si se envía archivo (imagen), subir a Cloudinary
        if (req.file) {
            try {
                // Usar el path y el nombre generado por multer
                imagenUrl = await uploadImage(req.file.path, req.file.filename);
            } catch (imgErr) {
                return res.status(400).json({
                    succes: false,
                    message: 'Error al subir la imagen',
                    error: imgErr.message
                });
            }
        }

        // Asignar la URL de la imagen si existe
        if (imagenUrl) {
            publicacionData.imagenUrl = imagenUrl;
        }

        const publicacion = new Publicacion(publicacionData);
        await publicacion.save();

        res.status(201).json({
            succes: true, 
            message: 'Publicacion creada con exito!',
            data: publicacion
        });
    } catch (error) {
        res.status(400).json({
            succes: false, 
            message: 'Error al crear la publicacion',
            error: error.message
        });
    }
}

//Listar Publicaciones
export const getPublicaciones = async(req, res) => {
    try {
        const { page = 1, limit = 10} = req.query;

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit),
            sort: { createdAt: -1 }
        }

        const publicaciones = await Publicacion.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort();

        const total = await Publicacion.countDocuments();

        res.status(200).json({
            success: true,
            data: publicaciones,
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
            message: 'Error al obtener las publicaciones',
            error: error.message
        })
    }
}

//Buscar publicacion por Id
export const getPublicacionById = async (req, res) => {
    try {
        const { id } = req.params;
        const publicacion = await Publicacion.findById(id);
            
        if (!publicacion) {
            return res.status(404).json({
                success: false,
                message: 'Publicacion no encontrada'
            });
        }
        
        res.status(200).json({
            success: true,
            data: publicacion
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al buscar la publicacion',
            error: error.message
        });
    }
};

//Actualizar Publicacion
export const updatePublicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const publicacionData = req.body;
        const { usuarioId } = publicacionData;
        
        // Buscar la publicación para verificar propiedad
        const publicacionExistente = await Publicacion.findById(id);
        
        if (!publicacionExistente) {
            return res.status(404).json({
                success: false,
                message: 'Publicacion no encontrada'
            });
        }

        // Validar que usuarioId fue enviado
        if (!usuarioId) {
            return res.status(400).json({
                success: false,
                message: 'El usuarioId es obligatorio en el body',
            });
        }

        // Validar que el usuario que intenta actualizar es el propietario
        if (publicacionExistente.usuarioId !== usuarioId) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para actualizar esta publicacion'
            });
        }
        
        const publicacion = await Publicacion.findByIdAndUpdate(
            id,
            publicacionData,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Publicacion actualizada exitosamente',
            data: publicacion
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar la publicacion',
            error: error.message
        });
    }
}

export const deletePublicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuarioId } = req.body;
        
        // Buscar la publicación para verificar propiedad
        const publicacion = await Publicacion.findById(id);
        
        if (!publicacion) {
            return res.status(404).json({
                success: false,
                message: 'Publicacion no encontrada'
            });
        }

        // Validar que usuarioId fue enviado
        if (!usuarioId) {
            return res.status(400).json({
                success: false,
                message: 'El usuarioId es obligatorio en el body'
            });
        }

        // Validar que el usuario que intenta eliminar es el propietario
        if (publicacion.usuarioId !== usuarioId) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permiso para eliminar esta publicacion'
            });
        }

        await Publicacion.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Publicacion eliminada exitosamente'
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al eliminar la publicacion',
            error: error.message
        });
    }
}