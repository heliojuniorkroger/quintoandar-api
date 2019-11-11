import PropertyVisit from '../../../models/PropertyVisit';
import Jwt from '../../../utils/Jwt';

export default async (req, res, next) => {
    try {
        const { id: userId } = Jwt.verify(req.headers['x-auth-token']);
        let visits = await PropertyVisit.scope('userScheduleResult').findAll({
            where: {
                userId,
            },
        });
        visits = await Promise.all(visits.map(async (visit) => {
            const _visit = visit.toJSON();
            delete _visit.propertyId;
            _visit.property = await visit.populateProperty();
            return _visit;
        }));
        res.json(visits);
    } catch (err) {
        next(err);
    }
};
