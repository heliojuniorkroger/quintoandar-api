import * as Yup from 'yup';
import UserProperty from '../../../models/UserProperty';
import elasticClient from '../../../singletons/elasticClient';
import Jwt from '../../../utils/Jwt';
import HttpError from '../../../utils/HttpError';

const validationSchema = Yup.object().shape({
    propertyId: Yup.string()
        .required(),
});

export default async (req, res, next) => {
    try {
        await validationSchema.validate(req.body);
        const { propertyId } = req.body;
        try {
            await elasticClient.get({
                index: 'properties',
                id: propertyId,
            });
        } catch (err) {
            if (err.status === 404) throw new HttpError(404, 'property not found');
        }
        const { id: userId } = Jwt.verify(req.headers['x-auth-token']);
        const [ userProperty, created ] = await UserProperty.findOrCreate({
            where: {
                propertyId,
                userId,
            },
            defaults: {
                propertyId,
                userId,
            },
        });
        if (!created) throw new HttpError(404, 'property already saved');
        const property = await userProperty.populate();
        res.json(property);
    } catch (err) {
        next(err);
    }
};
