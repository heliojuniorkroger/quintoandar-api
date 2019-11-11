import { Router } from 'express';
import getSchedule from './getSchedule';
import createVisit from './createVisit';
import updateVisit from './updateVisit';

const router = new Router();

router.get('/:id/schedule', getSchedule);
router.post('/:id/schedule', createVisit);
router.put('/:propertyId/schedule/:visitId', updateVisit);

export default router;
