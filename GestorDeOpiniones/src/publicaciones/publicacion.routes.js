import { Router } from 'express';
import { crearPublicacion, getPublicaciones, getPublicacionById, updatePublicacion, deletePublicacion} from './publicacion.controller.js';

const router = Router();

router.post(
    '/create',
    crearPublicacion
)

router.get(
    '/',
    getPublicaciones
)

router.get(
    '/:id',
    getPublicacionById
)

router.put(
    '/:id',
    updatePublicacion
)

router.delete(
    '/:id',
    deletePublicacion
)

export default router;