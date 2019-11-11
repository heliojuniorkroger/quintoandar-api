import { Router } from 'express';
import ak from './ak';

const router = new Router();

router.post('/ak', ak);

export default router;
