import { Router } from 'express';
import users from './users';
import authentication from './authentication';
import properties from './properties';

const router = new Router();

router.use('/users', users);
router.use('/authentication', authentication);
router.use('/properties', properties);

export default router;
