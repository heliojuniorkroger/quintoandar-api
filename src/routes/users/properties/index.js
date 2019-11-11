import { Router } from 'express';
import save from './save';
import listAll from './listAll';
import remove from './remove';

const router = new Router();

router.post('/', save);
router.get('/', listAll);
router.delete('/:id', remove);

export default router;
