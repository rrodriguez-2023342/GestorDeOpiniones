'use strict';

import mongoose from 'mongoose';

//Creamos el esquema para los comentarios
const comentarioSchema = mongoose.Schema({
    contenidoComentario: {
        type: String,
        required: [true, 'El contenido del comentario es obligatorio'],
        trim: true,
        minLength: [5, 'El contenido del comentario debe tener al menos 5 caracteres'],
        maxLength: [500, 'EL contenido del comentario no puede exceder de los 500 caracteres']
    },
    publicacionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Publicaciones',
        required: [true, 'El ID de la Publicacion es obligatorio']
    },
    userId: {
        type: String,
        required: [true, 'El ID del Usuario es obligatorio']
    }
}, {
    timestamps: true,
    versionKey: false
});

//Indices para las que las busquedas sean mas rapidas
comentarioSchema.index({ publicacionId: 1 });
comentarioSchema.index({ userId: 1 });

//Exportamos el modelo
export default mongoose.model('Comentario', comentarioSchema);