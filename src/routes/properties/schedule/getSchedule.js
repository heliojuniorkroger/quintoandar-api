import * as Yup from 'yup';
import { Op } from 'sequelize';
import Schedule from '../../../utils/Schedule';
import HttpError from '../../../utils/HttpError';
import PropertyVisit from '../../../models/PropertyVisit';
import elasticClient from '../../../singletons/elasticClient';

const validationSchema = Yup.object().shape({
    id: Yup.string()
        .required(),
});

export default async (req, res, next) => {
    try {
        await validationSchema.validate(req.params);
        const { id: propertyId } = req.params;
        try {
            await elasticClient.get({
                index: 'properties',
                id: propertyId,
            });
        } catch (err) {
            if (err.status === 404) throw new HttpError(404, 'property not found');
        }
        const visits = await PropertyVisit.scope('propertyScheduleResult').findAll({
            where: {
                propertyId,
                status: { [Op.not]: 'cancelled' },
            },
        });
        const schedule = new Schedule(visits);
        const result = await schedule.createSchedule();
        res.json(result);
    } catch (err) {
        next(err);
    }
};
