'use strict';

import mongoose from 'mongoose';

const publicacionSchema = mongoose.Schema({
    usuarioId:{
        type: String,
        required: [true, 'El ID del Usuario es obligatori']
    },
    tituloPublicacion: {
        type: String,
        required: [true, 'El titulo de la publicacion es obligatorio'],
        minLength: [5, 'El titulo de la publicacion debe tener al menos 5 caracteres'],
        maxLength: [100, 'El titulod de la publicacion no puede exceder de los 100 caracteres']
    }, 
    categoriaPublicacion: {
        type: String,
        required: [true, 'La categoria de la publicacion es obligatoria'],
        trim: true,
        maxLength: [100, 'La categoria de la publicacion no puede exceder de los 100 caracteres']
    },
    contenido: {
        type: String,
        required: [true, 'El contenido de la publicacion es requerido'],
        minLength: [5, 'El contenido de la publicacion debe tener al menos 5 caracteres'],
    },
    isActiva: {
        type: Boolean,
        default: true
    },
    imagenUrl: {
        type: String,
        required: false,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
});

publicacionSchema.index({ usuarioId: 1});
publicacionSchema.index({ categoriaPublicacion: 1});

export default mongoose.model('Publicaciones', publicacionSchema);