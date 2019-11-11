import * as Yup from 'yup';
import HttpError from '../../../utils/HttpError';
import PropertyVisit from '../../../models/PropertyVisit';
import elasticClient from '../../../singletons/elasticClient';

const paramsValidationSchema = Yup.object().shape({
    propertyId: Yup.string()
        .required(),
    visitId: Yup.string()
        .required(),
});

const bodyValidationSchema = Yup.object().shape({
    status: Yup.string()
        .required()
        .oneOf([ 'cancelled', 'done' ]),
});

export default async (req, res, next) => {
    try {
        await paramsValidationSchema.validate(req.params);
        await bodyValidationSchema.validate(req.body);
        const { propertyId, visitId } = req.params;
        const { status } = req.body;
        try {
            await elasticClient.get({
                index: 'properties',
                id: propertyId,
            });
        } catch (err) {
            if (err.status === 404) throw new HttpError(404, 'property not found');
        }
        const visit = await PropertyVisit.findByPk(visitId);
        if (visit.status === 'cancelled' || visit.status === 'done') throw new HttpError(400, 'definitive stauts already set');
        if (!visit) throw new HttpError(404, 'visit not found');
        await PropertyVisit.update({ status }, {
            where: {
                propertyId,
                id: visitId,
            },
        });
        res.json({ updated: true });
    } catch (err) {
        next(err);
    }
};
