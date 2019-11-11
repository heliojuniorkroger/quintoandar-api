import { Router } from 'express';
import me from './me';
import update from './update';
import properties from './properties';
import schedule from './schedule';

const router = new Router();

router.get('/me', me);
router.put('/me', update);
router.use('/properties', properties);
router.use('/schedule', schedule);

export default router;
