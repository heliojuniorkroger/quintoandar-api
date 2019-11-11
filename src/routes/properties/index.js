import { Router } from 'express';
import search from './search';
import schedule from './schedule';

const router = new Router();

router.get('/search', search);
router.use('/', schedule);

export default router;
