import { Router } from 'express';
import getSchedule from './getSchedule';

const router = new Router();

router.get('/', getSchedule);

export default router;
