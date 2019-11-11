import * as Yup from 'yup';
import HttpError from '../../../utils/HttpError';
import Jwt from '../../../utils/Jwt';
import PropertyVisit from '../../../models/PropertyVisit';
import elasticClient from '../../../singletons/elasticClient';

const paramsValidationSchema = Yup.object().shape({
    id: Yup.string()
        .required(),
});

const bodyValidationSchema = Yup.object().shape({
    date: Yup.date()
        .required(),
});

export default async (req, res, next) => {
    try {
        await paramsValidationSchema.validate(req.params);
        await bodyValidationSchema.validate(req.body);
        const { id: userId } = Jwt.verify(req.headers['x-auth-token']);
        const { id: propertyId } = req.params;
        const { date: scheduledDate } = req.body;
        try {
            await elasticClient.get({
                index: 'properties',
                id: propertyId,
            });
        } catch (err) {
            if (err.status === 404) throw new HttpError(404, 'property not found');
        }
        const [ visit, created ] = await PropertyVisit.findOrCreate({
            defaults: {
                scheduledDate,
                propertyId,
                userId,
            },
            where: {
                scheduledDate,
                propertyId,
            },
        });
        if (!created) throw new HttpError(400, 'visit already scheduled');
        res.json(visit);
    } catch (err) {
        next(err);
    }
};
