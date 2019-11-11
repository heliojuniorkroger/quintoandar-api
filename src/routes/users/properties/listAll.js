import UserProperty from '../../../models/UserProperty';
import Jwt from '../../../utils/Jwt';

export default async (req, res, next) => {
    try {
        const { id: userId } = Jwt.verify(req.headers['x-auth-token']);
        const userProperties = await UserProperty.findAll({
            where: { userId },
        });
        const properties = await Promise.all(userProperties.map((property) => property.populate()));
        res.json(properties);
    } catch (err) {
        next(err);
    }
};
