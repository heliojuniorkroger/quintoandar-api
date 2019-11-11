import * as Yup from 'yup';
import UserProperty from '../../../models/UserProperty';
import Jwt from '../../../utils/Jwt';

const validationSchema = Yup.object().shape({
    id: Yup.string()
        .required(),
});

export default async (req, res, next) => {
    try {
        await validationSchema.validate(req.params);
        const { id: propertyId } = req.params;
        const { id: userId } = Jwt.verify(req.headers['x-auth-token']);
        await UserProperty.destroy({ where: { userId, propertyId } });
        res.json({ removed: true });
    } catch (err) {
        next(err);
    }
};
