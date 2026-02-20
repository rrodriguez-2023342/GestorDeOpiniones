import { Router } from 'express';
import { crearPublicacion, getPublicaciones, getPublicacionById, updatePublicacion, deletePublicacion} from './publicacion.controller.js';
import { validateCreatePublicacion, validateUpdatePublicacion, validateDeletePublicacion } from '../../middlewares/publicacion-validators.js';

const router = Router();

router.post(
    '/create',
    validateCreatePublicacion, //Valiadcion antes de crear una publicacion
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
    validateUpdatePublicacion, //Validacion antes de actualizar una publicacion
    updatePublicacion
)

router.delete(
    '/:id',
    validateDeletePublicacion, //Validacion antes de eliminar una publicacion
    deletePublicacion
)

export default router;