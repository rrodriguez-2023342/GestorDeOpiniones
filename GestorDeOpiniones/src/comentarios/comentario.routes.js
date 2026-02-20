import { Router } from 'express';
import { crearComentario, getComentarios, getComentarioById, updateComentario, deleteComentario} from './comentario.controller.js';
import { validateCreateComentario, validateUpdateComentario, validateDeleteComentario } from '../../middlewares/comentario-validators.js';

const router = Router();

router.post(
    '/create',
    validateCreateComentario, //Validacion antes de crear un comentario
    crearComentario
)

router.get(
    '/',
    getComentarios
)

router.get(
    '/:id',
    getComentarioById
)

router.put(
    '/:id',
    validateUpdateComentario, //Validacion antes de actualizar un comentario
    updateComentario
)

router.delete(
    '/:id',
    validateDeleteComentario, //Validacion antes de eliminar un comentario
    deleteComentario
)

export default router;