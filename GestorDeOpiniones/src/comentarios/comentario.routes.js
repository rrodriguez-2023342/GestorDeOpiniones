import { Router } from 'express';
import { crearComentario, getComentarios, getComentarioById, updateComentario, deleteComentario} from './comentario.controller.js';

const router = Router();

router.post(
    '/create',
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
    updateComentario
)

router.delete(
    '/:id',
    deleteComentario
)

export default router;