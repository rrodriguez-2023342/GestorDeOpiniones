import { Router } from 'express';
import {
    updateUserRole,
    getUserRoles,
    getUsersByRole,
    getUserById,
} from './user.controller.js';

const router = Router();

router.get(
    '/by-role/:roleName', 
    ...getUsersByRole
);

router.put(
    '/:userId/role', 
    ...updateUserRole
);

router.get(
    '/:userId/roles',
    ...getUserRoles
);

router.get(
    '/:userId', 
    getUserById
);

export default router;
